import React from "react";
import { Pressable, Text, View } from "react-native";
import { cn } from "@/lib/utils";

interface ChildButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

export const ChildButton: React.FC<ChildButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
}) => {
  const baseStyles = "flex items-center justify-center rounded-3xl font-bold";

  const variantStyles = {
    primary: "bg-child-primary",
    secondary: "bg-child-secondary",
    accent: "bg-child-accent",
    outline: "bg-white border-4 border-child-primary/20",
  };

  const sizeStyles = {
    small: "px-4 py-2",
    medium: "px-6 py-4",
    large: "px-8 py-5",
  };

  const textSizeStyles = {
    small: "text-sm",
    medium: "text-lg",
    large: "text-2xl",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "active:scale-95 transition-transform duration-100",
        disabled && "opacity-50"
      )}
    >
      {({ pressed }) => (
        <View
          className={cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            "shadow-lg",
            pressed && "translate-y-0.5 shadow-sm"
          )}
          style={{
            // Premium 3D effect for non-outline variants
            borderBottomWidth: variant === "outline" ? 0 : 6,
            borderBottomColor: variant === "primary" ? "#E64A19" : variant === "secondary" ? "#0D47A1" : "#FBC02D",
          }}
        >
          <Text
            className={cn(
              "font-black tracking-tight uppercase",
              variant === "outline" ? "text-child-primary" : "text-white",
              textSizeStyles[size]
            )}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

