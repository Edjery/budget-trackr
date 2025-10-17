import { useSettings } from './useSettings';
import { useTransactions } from './useTransactions';

export const useDataManagement = () => {
    const { importSettings } = useSettings();
    const { importTransactions } = useTransactions();

    const exportAllData = () => {
        const settings = localStorage.getItem('userSettings') || '{}';
        const transactions = localStorage.getItem('transactions') || '[]';
        return { settings: JSON.parse(settings), transactions };
    };

    const importAllData = async (data: { settings: any; transactions: string }) => {
        try {
            await importSettings(data.settings);
            await importTransactions(data.transactions);
            return { success: true };
        } catch (error) {
            console.error('Error importing data:', error);
            throw error;
        }
    };

    return {
        exportAllData,
        importAllData,
    };
};