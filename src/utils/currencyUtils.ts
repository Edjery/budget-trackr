export type Currency = {
    symbol: string;
    code: string;
    locale: string;
    name: string;
};

export const CURRENCIES: Record<string, Currency> = {
    PHP: {
        symbol: '₱',
        code: 'PHP',
        locale: 'fil-PH',
        name: 'Philippine Peso'
    },
    USD: {
        symbol: '$',
        code: 'USD',
        locale: 'en-US',
        name: 'US Dollar'
    },
    EUR: {
        symbol: '€',
        code: 'EUR',
        locale: 'en-150',
        name: 'Euro'
    },
    JPY: {
        symbol: '¥',
        code: 'JPY',
        locale: 'ja-JP',
        name: 'Japanese Yen'
    },
    GBP: {
        symbol: '£',
        code: 'GBP',
        locale: 'en-GB',
        name: 'British Pound'
    },
    AUD: {
        symbol: 'A$',
        code: 'AUD',
        locale: 'en-AU',
        name: 'Australian Dollar'
    },
    CAD: {
        symbol: 'C$',
        code: 'CAD',
        locale: 'en-CA',
        name: 'Canadian Dollar'
    },
    CNY: {
        symbol: '¥',
        code: 'CNY',
        locale: 'zh-CN',
        name: 'Chinese Yuan'
    },
    INR: {
        symbol: '₹',
        code: 'INR',
        locale: 'en-IN',
        name: 'Indian Rupee'
    },
    KRW: {
        symbol: '₩',
        code: 'KRW',
        locale: 'ko-KR',
        name: 'South Korean Won'
    }
} as const;

// Default to PHP - will be overridden by user settings
export let CURRENCY: Currency = CURRENCIES.PHP;

/**
 * Set the active currency
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'EUR', 'PHP')
 */
export const setCurrency = (currencyCode: string): boolean => {
    const newCurrency = CURRENCIES[currencyCode];
    if (newCurrency) {
        CURRENCY = newCurrency;
        // Dispatch event for components that need to react to currency changes
        window.dispatchEvent(new CustomEvent('currencyChanged', { detail: currencyCode }));
        return true;
    }
    return false;
};

/**
 * Get currency by code
 */
export const getCurrency = (code: string): Currency | undefined => {
    return CURRENCIES[code];
};

type FormatCurrencyOptions = {
    showSymbol?: boolean;
    decimalPlaces?: number;
    currency?: string;
};

// Format currency with proper symbol and number formatting
export const formatCurrency = (
    amount: number,
    code: string = "PHP",
): string => {
    const currencyData = CURRENCIES[code] || CURRENCY;
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);

    const formattedNumber = `${isNegative ? "-" : ""}${currencyData.symbol}${absoluteAmount}`
    return formattedNumber
};


export const formatCurrencyWithCommas = (
    amount: number,
    options: FormatCurrencyOptions = { showSymbol: true, decimalPlaces: 2 }
): string => {
    const { showSymbol = true, decimalPlaces = 2 } = options;
    
    const formatter = new Intl.NumberFormat(CURRENCY.locale, {
        style: 'currency',
        currency: CURRENCY.code,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
        currencyDisplay: 'symbol'
    });
    
    let formatted = formatter.format(amount);
    
    // For some locales, the formatter might not use the symbol we want
    if (showSymbol && !formatted.includes(CURRENCY.symbol)) {
        formatted = formatted.replace(/[^\d.,\s-]/g, '').trim();
        return `${CURRENCY.symbol}${formatted}`;
    }
    
    return showSymbol ? formatted : formatted.replace(/[^\d.,\s-]/g, '').trim();
};

/**
 * Get a list of all available currencies
 */
export const getAvailableCurrencies = (): Currency[] => {
    return Object.values(CURRENCIES);
};

/**
 * Get the current currency settings
 */
export const getCurrentCurrency = (): Currency => {
    return CURRENCY;
};

export const getCurrentLocale = (): string => {
    return CURRENCY.locale;
};