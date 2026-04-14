import React from "react";
import { Pressable, Text } from "react-native";
import { cn } from "@/lib/utils";

interface ParentButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

export const ParentButton: React.FC<ParentButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
}) => {
  const baseStyles = "flex items-center justify-center rounded-lg font-semibold";

  const variantStyles = {
    primary: "bg-parent-primary",
    secondary: "bg-parent-secondary",
    outline: "border border-parent-primary",
  };

  const textColorStyles = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-parent-primary",
  };

  const sizeStyles = {
    small: "px-4 py-2",
    medium: "px-6 py-3",
    large: "px-8 py-4",
  };

  const textSizeStyles = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50"
      )}
    >
      <Text className={cn(textSizeStyles[size], textColorStyles[variant])}>
        {label}
      </Text>
    </Pressable>
  );
};
