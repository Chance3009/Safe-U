import { Appearance } from 'react-native';
import { useState } from 'react';
export default function useDarkMode(){
  const [darkMode, setDarkMode] = useState(Appearance.getColorScheme());
  function toggleDarkMode(){
    Appearance.setColorScheme(darkMode === 'dark' ? 'light' : 'dark');
    setDarkMode(darkMode === 'dark' ? 'light' : 'dark');
  }
  return {darkMode, toggleDarkMode};
}