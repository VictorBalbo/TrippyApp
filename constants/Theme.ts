export type ColorScheme = {
  background: string;
  backgroundSoft: string;
  backgroundAccent: string;
  text: string;
  helperText: string
  link: string;
  activeTint: string;
  inactiveTint: string;
  border: string;
};
export type BaseScheme = {
  smallSpacing: number;
  largeSpacing: number;
  borderRadius: number;
  textSize: number;
};

export type ThemeScheme = {
  light: ColorScheme;
  dark: ColorScheme;
  base: BaseScheme;
};

export const Colors = {
  whiteLight: '#ffffff',
  white: '#f0f0f0',
  whiteDeep: '#e4e4e7',

  gray: '#73737C',

  blackLight: '#313133',
  black: '#1B1B1B',
  blackDeep: '#000000',

  red: '#D70015',
  blue: '#007AFF',
  yellow: "#ffcc00",
};

export const Theme: ThemeScheme = {
  /// TODO: Review light mode
  light: {
    text: Colors.black,
    helperText: Colors.gray,
    link: Colors.blue,
    background: Colors.whiteLight,
    backgroundSoft: Colors.white,
    backgroundAccent: Colors.whiteDeep,
    activeTint: Colors.blackLight,
    inactiveTint: Colors.gray,
    border: Colors.gray,
  },
  dark: {
    text: Colors.white,
    helperText: Colors.gray,
    link: Colors.blue,
    background: Colors.blackDeep,
    backgroundSoft: Colors.black,
    backgroundAccent: Colors.blackLight,
    activeTint: Colors.white,
    inactiveTint: Colors.gray,
    border: Colors.gray,
  },
  base: {
    smallSpacing: 8,
    largeSpacing: 16,
    borderRadius: 8,
    textSize: 16,
  },
};
