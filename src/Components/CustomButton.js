import { Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'
import { heightToDp, widthToDp } from '../Theme/Dimensions'

const CustomButton = ({
    title,
    onPress,
    variant = 'primary', // primary, secondary, danger, outline
    size = 'medium', // small, medium, large
    disabled = false,
    style,
    textStyle,
    ...props
}) => {
    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[size]];
        
        if (disabled) {
            baseStyle.push(styles.disabled);
        } else {
            baseStyle.push(styles[variant]);
        }
        
        if (style) baseStyle.push(style);
        return baseStyle;
    };

    const getTextStyle = () => {
        const baseTextStyle = [styles.buttonText, styles[`${size}Text`]];
        
        if (disabled) {
            baseTextStyle.push(styles.disabledText);
        } else {
            baseTextStyle.push(styles[`${variant}Text`]);
        }
        
        if (textStyle) baseTextStyle.push(textStyle);
        return baseTextStyle;
    };

    return (
        <Pressable
            style={getButtonStyle()}
            onPress={disabled ? null : onPress}
            {...props}
        >
            <Text style={getTextStyle()}>{title}</Text>
        </Pressable>
    );
};

export default CustomButton;

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    
    // Sizes
    small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 36,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        minHeight: 44,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        minHeight: 52,
    },
    
    // Variants
    primary: {
        backgroundColor: "#3b82f6",
    },
    secondary: {
        backgroundColor: "#6b7280",
    },
    danger: {
        backgroundColor: "#dc2626",
    },
    outline: {
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#d1d5db",
        elevation: 1,
    },
    disabled: {
        backgroundColor: "#e5e7eb",
        elevation: 0,
        shadowOpacity: 0,
    },
    
    // Text styles
    buttonText: {
        fontWeight: "600",
        textAlign: 'center',
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
    primaryText: {
        color: "white",
    },
    secondaryText: {
        color: "white",
    },
    dangerText: {
        color: "white",
    },
    outlineText: {
        color: "#374151",
    },
    disabledText: {
        color: "#9ca3af",
    },
});