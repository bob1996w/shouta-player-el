import { DefaultTheme } from 'styled-components';

export const DefaultPlayerTheme: DefaultTheme = {
    borderRadius: '1px',

    colors: {
        tone: {
            primary: '#ffc107',
            primary_light: '#fff350',
            primary_dark: '#c79100',
            secondary: '#29b6f6',
            secondary_light: '#73e8ff',
            secondary_dark: '#0086c3'
        },
        background: {
            background: '#121212',
            surface: '#1f1f1f'
        },
        text: {
            main: '#e0e0e0',
            auxiliary: '#a0a0a0'
        },
        actionText: {
            onPrimary: '#000000',
            onSecondary: '#000000'
        }
    }
}