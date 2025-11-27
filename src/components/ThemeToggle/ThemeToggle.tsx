import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { SunIcon, MoonIcon, AutoThemeIcon } from '../Icons';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, currentTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon size={20} color={currentTheme.colors.text} />;
      case 'dark':
        return <MoonIcon size={20} color={currentTheme.colors.text} />;
      case 'auto':
        return <AutoThemeIcon size={20} color={currentTheme.colors.text} />;
      default:
        return <AutoThemeIcon size={20} color={currentTheme.colors.text} />;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: currentTheme.colors.card }
      ]}
      onPress={toggleTheme}
    >
      {getIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default ThemeToggle;