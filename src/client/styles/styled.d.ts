import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        borderRadius: string,

        colors: {
            tone: {
                primary: string,
                primary_light: string,
                primary_dark: string,
                secondary: string,
                secondary_light: string,
                secondary_dark: string
            },
            background: {
                background: string,
                surface: string
            },
            text: {
                main: string,
                auxiliary: string
            },
            actionText: {
                onPrimary: string,
                onSecondary: string
            }
        }
    }
}