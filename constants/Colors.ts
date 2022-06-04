const tintColorLight = '#dc6e2f';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    secondaryColor: '#aed581',
    modal: '#fff'
  },
  dark: {
    text: '#fff',
    background: '#212121',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    secondaryColor: '#7da453',
    modal: '#484848'
  },
  lightMode: {
    primary: {
      text: "#000000",
      normal: "#fafafa",
      light: "#ffffff",
      dark: "#c7c7c7"
    },
    secondary: {
      text: "#000000",
      normal: "#8bc34a",
      light: "#bef67a",
      dark: "#5a9216"
    },
  },
  darkMode: {
    primary: {
      text: '#ffffff',
      normal: '#212121',
      dark: '#000000',
      light: '#484848'
    },
    secondary: {
      text: '#000000',
      normal: '#aed581',
      dark: '#7da453',
      light: '#e1ffb1'
    }
  }
};
