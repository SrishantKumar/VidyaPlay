import React from "react";
import { TextInput as RNTextInput, View, Text } from "react-native";
import { cn } from "@/lib/utils";

interface TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  label?: string;
  error?: string;
  editable?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  label,
  error,
  editable = true,
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-text-primary font-semibold mb-2">{label}</Text>
      )}
      <RNTextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        className={cn(
          "bg-bg-dark border border-border-light rounded-lg px-4 py-3 text-text-primary",
          error && "border-child-danger"
        )}
        placeholderTextColor="#9CA3AF"
        style={{ fontSize: 16 }}
      />
      {error && (
        <Text className="text-child-danger text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};
