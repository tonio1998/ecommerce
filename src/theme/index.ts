const colors = {
    light: {
        background: '#F4F7FB',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        muted: '#E5E7EB',
        muted_soft: '#F1F5F9',

        text: '#0F172A',
        text_secondary: '#64748B',
        border: '#E2E8F0',
        inputBackground: '#FFFFFF',

        primary: '#0B5ED7',
        primary_dark: '#083A8C',
        primary_light: '#60A5FA',
        button: '#14B8A6',
        secondary: '#22C55E',

        success: '#22C55E',
        success_soft: '#DCFCE7',

        danger: '#EF4444',
        danger_soft: '#FEE2E2',

        warning: '#FACC15',
        warning_soft: '#FEF3C7',

        info: '#0EA5E9',
        info_soft: '#E0F2FE',

        link: '#0B5ED7',
        highlight: '#14B8A6',
    },

    dark: {
        background: '#0B1220',
        surface: '#111827',
        card: '#1F2933',
        muted: '#374151',
        muted_soft: '#1E293B',

        text: '#F8FAFC',
        text_secondary: '#CBD5E1',
        border: '#334155',
        inputBackground: '#111827',

        primary: '#60A5FA',
        primary_dark: '#0B5ED7',
        primary_light: '#93C5FD',
        button: '#14B8A6',
        secondary: '#22C55E',

        success: '#4ADE80',
        success_soft: '#14532D',

        danger: '#F87171',
        danger_soft: '#7F1D1D',

        warning: '#FDE047',
        warning_soft: '#713F12',

        info: '#38BDF8',
        info_soft: '#075985',

        link: '#60A5FA',
        highlight: '#14B8A6',
    },
};

const spacing = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};


const fontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
};


export const font = {
    thin: 'Inter_28pt-Thin',
    extraLight: 'Inter_28pt-ExtraLight',
    light: 'Inter_28pt-Light',
    regular: 'Inter_28pt-Regular',
    medium: 'Inter_28pt-Medium',
    semiBold: 'Inter_28pt-SemiBold',
    bold: 'Inter_28pt-Bold',
    extraBold: 'Inter_28pt-ExtraBold',
    black: 'Inter_28pt-Black',
};

export const fontPoppins = {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    italic: 'Poppins-Italic',
    light: 'Poppins-Light',
    thin: 'Poppins-Thin',
    black: 'Poppins-Black',
};

export const FontFamily = 'MazzardSoftH-SemiBold';
export const FontFamilyNormal = 'MazzardSoftH-Regular';

export const radius = {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
};


export const elevation = {
    none: 0,
    sm: 2,
    md: 5,
    lg: 10,
    xl: 20,
};

export const opacity = {
    disabled: 0.4,
    semi: 0.6,
    hover: 0.8,
    full: 1,
};

const FLOATING_NAV_HEIGHT = 90;
const PADDING_TOP = 20;

export const theme = {
    colors,
    spacing,
    fontSizes,
    font,
    fontPoppins,
    radius,
    elevation,
    opacity,
    FLOATING_NAV_HEIGHT,
    PADDING_TOP,
};
