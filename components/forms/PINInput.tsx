import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

interface PINInputProps {
  onComplete: (pin: string) => void;
  length?: number;
}

export const PINInput: React.FC<PINInputProps> = ({ onComplete, length = 4 }) => {
  const [pin, setPin] = useState("");

  const handleNumPress = (num: string) => {
    if (pin.length < length) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === length) {
        onComplete(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <View className="flex-1 justify-center">
      {/* PIN Display */}
      <View className="flex-row justify-center gap-4 mb-8">
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            className="w-16 h-16 bg-parent-accent rounded-full flex items-center justify-center"
          >
            {pin[i] && (
              <Text className="text-2xl font-bold text-white">•</Text>
            )}
          </View>
        ))}
      </View>

      {/* Number Pad */}
      <View className="gap-4">
        {[0, 1, 2].map((row) => (
          <View key={row} className="flex-row justify-center gap-4">
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              const num = numbers[index];
              return (
                <Pressable
                  key={num}
                  onPress={() => handleNumPress(num)}
                  className="w-16 h-16 bg-parent-primary rounded-full flex items-center justify-center"
                >
                  <Text className="text-2xl font-bold text-white">
                    {num}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}

        {/* Zero and Backspace */}
        <View className="flex-row justify-center gap-4">
          <View style={{ width: 64 }} />
          <Pressable
            onPress={() => handleNumPress("0")}
            className="w-16 h-16 bg-parent-primary rounded-full flex items-center justify-center"
          >
            <Text className="text-2xl font-bold text-white">0</Text>
          </Pressable>
          <Pressable
            onPress={handleBackspace}
            className="w-16 h-16 bg-child-danger rounded-full flex items-center justify-center"
          >
            <Text className="text-xl text-white">←</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
