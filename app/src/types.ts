export {};

declare global {
    interface Window {
        electronStorage: {
            getItem: (key: string) => string | null;
            setItem: (key: string, value: string) => void;
        };
        electronAPI?: {
            getPlatform?: () => Promise<string>;
            minimize?: () => void;
            close?: () => void;
            pingHttp: (url: string) => Promise<number | null>;
        };
    }
}