import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ButtonProps } from './types';
import { useTheme } from '../../theme/ThemeContext';

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...rest
}) => {
  const { currentTheme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
      ...getVariantStyle(variant, currentTheme),
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...styles.text,
      ...sizeStyles.text[size],
      ...getVariantTextStyle(variant, currentTheme),
    };
  };

  const getActivityColor = (): string => {
    return variantStyles[variant].getActivityColor(currentTheme);
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getActivityColor()} 
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

// Size styles remain the same
const sizeStyles = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    small: {
      fontSize: 14,
    },
    medium: {
      fontSize: 16,
    },
    large: {
      fontSize: 18,
    },
  },
};

// Updated variant styles with ALL variants including warning
const variantStyles = {
  primary: {
    getStyle: (theme: any) => ({
      backgroundColor: theme.colors.primary,
      borderWidth: 0,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.1,
    }),
    getTextStyle: (theme: any) => ({
      color: '#FFFFFF',
    }),
    getActivityColor: (theme: any) => '#FFFFFF',
  },
  secondary: {
    getStyle: (theme: any) => ({
      backgroundColor: theme.colors.textMuted,
      borderWidth: 0,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.1,
    }),
    getTextStyle: (theme: any) => ({
      color: '#FFFFFF',
    }),
    getActivityColor: (theme: any) => '#FFFFFF',
  },
  success: {
    getStyle: (theme: any) => ({
      backgroundColor: theme.colors.success,
      borderWidth: 0,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.1,
    }),
    getTextStyle: (theme: any) => ({
      color: '#FFFFFF',
    }),
    getActivityColor: (theme: any) => '#FFFFFF',
  },
  warning: {
    getStyle: (theme: any) => ({
      backgroundColor: theme.colors.warning,
      borderWidth: 0,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.1,
    }),
    getTextStyle: (theme: any) => ({
      color: '#FFFFFF',
    }),
    getActivityColor: (theme: any) => '#FFFFFF',
  },
  error: {
    getStyle: (theme: any) => ({
      backgroundColor: theme.colors.error,
      borderWidth: 0,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.1,
    }),
    getTextStyle: (theme: any) => ({
      color: '#FFFFFF',
    }),
    getActivityColor: (theme: any) => '#FFFFFF',
  },
  outline: {
    getStyle: (theme: any) => ({
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary,
      shadowOpacity: 0,
      elevation: 0,
    }),
    getTextStyle: (theme: any) => ({
      color: theme.colors.primary,
    }),
    getActivityColor: (theme: any) => theme.colors.primary,
  },
  ghost: {
    getStyle: (theme: any) => ({
      backgroundColor: 'transparent',
      borderWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
    }),
    getTextStyle: (theme: any) => ({
      color: theme.colors.primary,
    }),
    getActivityColor: (theme: any) => theme.colors.primary,
  },
};

const getVariantStyle = (variant: keyof typeof variantStyles, theme: any): ViewStyle => {
  return variantStyles[variant].getStyle(theme);
};

const getVariantTextStyle = (variant: keyof typeof variantStyles, theme: any): TextStyle => {
  return variantStyles[variant].getTextStyle(theme);
};

export default Button;