import { createTheme } from "@mui/material/styles";
import { grey, blue, deepPurple, common } from "@mui/material/colors";

declare module "@mui/material/styles" {
    interface Theme {
        custom: {
            header: {
                height: number;
                background: string;
            };
            sidebar: {
                width: number;
                background: string;
                text: string;
                activeLink: string;
            };
        };
    }
    interface ThemeOptions {
        custom?: {
            header?: {
                height?: number;
                background?: string;
            };
            sidebar?: {
                width?: number;
                background?: string;
                text?: string;
                activeLink?: string;
            };
        };
    }
}

export const createAppTheme = (mode: "light" | "dark") => {
    const isDark = mode === "dark";

    const baseTheme = {
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontSize: '2.5rem', fontWeight: 500 },
            h2: { fontSize: '2rem', fontWeight: 500 },
            h3: { fontSize: '1.75rem', fontWeight: 500 },
            h4: { fontSize: '1.5rem', fontWeight: 500 },
            h5: { fontSize: '1.25rem', fontWeight: 500 },
            h6: { fontSize: '1rem', fontWeight: 500 },
        },
        shape: {
            borderRadius: 8,
        },
        custom: {
            header: {
                height: 64,
            },
            sidebar: {
                width: 240,
            },
        },
    };

    const lightTheme = createTheme({
        ...baseTheme,
        palette: {
            mode: 'light',
            primary: {
                main: blue[700],
                light: blue[500],
                dark: blue[900],
                contrastText: common.white,
            },
            secondary: {
                main: deepPurple[500],
                light: deepPurple[300],
                dark: deepPurple[700],
                contrastText: common.white,
            },
            background: {
                default: grey[50],
                paper: common.white,
            },
            text: {
                primary: 'rgba(0, 0, 0, 0.87)',
                secondary: 'rgba(0, 0, 0, 0.6)',
                disabled: 'rgba(0, 0, 0, 0.38)',
            },
            divider: 'rgba(0, 0, 0, 0.12)',
        },
        custom: {
            ...baseTheme.custom,
            header: {
                ...baseTheme.custom.header,
                background: blue[700],
            },
            sidebar: {
                ...baseTheme.custom.sidebar,
                background: grey[100],
                text: grey[800],
                activeLink: blue[700],
            },
        },
    });

    const darkTheme = createTheme({
        ...baseTheme,
        palette: {
            mode: 'dark',
            primary: {
                main: blue[400],
                light: blue[500],
                dark: blue[300],
                contrastText: common.white,
            },
            secondary: {
                main: deepPurple[200],
                light: deepPurple[300],
                dark: deepPurple[100],
                contrastText: common.white,
            },
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            },
            text: {
                primary: 'rgba(255, 255, 255, 0.87)',
                secondary: 'rgba(255, 255, 255, 0.7)',
                disabled: 'rgba(255, 255, 255, 0.5)',
            },
            divider: 'rgba(255, 255, 255, 0.12)',
        },
        custom: {
            ...baseTheme.custom,
            header: {
                ...baseTheme.custom.header,
                background: '#1a1a1a',
            },
            sidebar: {
                ...baseTheme.custom.sidebar,
                background: '#1e1e1e',
                text: grey[300],
                activeLink: blue[200],
            },
        },
    });

    return isDark ? darkTheme : lightTheme;
};

export type AppTheme = ReturnType<typeof createAppTheme>;
