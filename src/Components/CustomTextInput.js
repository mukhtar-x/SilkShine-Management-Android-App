import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { heightToDp, widthToDp } from '../Theme/Dimensions'

const CustomTextInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    helper,
    required = false,
    multiline = false,
    keyboardType = 'default',
    maxLength,
    numberOfLines = 1,
    style,
    inputStyle,
    labelStyle,
    editable = true,
    ...props
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}

            <TextInput
                style={[
                    styles.input,
                    multiline && styles.multilineInput,
                    error && styles.inputError,
                    !editable && styles.inputDisabled,
                    inputStyle
                ]}
                value={value !== undefined && value !== null ? String(value) : ""}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={multiline ? numberOfLines : 1}
                maxLength={maxLength}
                editable={editable}
                {...props}
            />

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            {helper && !error && (
                <Text style={styles.helperText}>{helper}</Text>
            )}
        </View>
    );
};

export default CustomTextInput;

const styles = StyleSheet.create({
    container: {
        marginBottom: heightToDp(2),
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    required: {
        color: "#dc2626",
        fontSize: 16,
    },
    input: {
        borderWidth: 1.5,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: "white",
        color: "#1f2937",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
    inputError: {
        borderColor: "#dc2626",
        borderWidth: 2,
    },
    inputDisabled: {
        backgroundColor: "#f9fafb",
        color: "#6b7280",
    },
    errorText: {
        fontSize: 14,
        color: "#dc2626",
        marginTop: 6,
        fontWeight: "500",
    },
    helperText: {
        fontSize: 13,
        color: "#6b7280",
        marginTop: 4,
        fontStyle: "italic",
    },
});