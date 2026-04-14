import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TextInput } from "@/components/forms/TextInput";
import { ChildButton } from "@/components/buttons/ChildButton";
import { ParentLayout } from "@/components/layouts/ParentLayout";

export default function ChildSetupScreen() {
  const router = useRouter();
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [error, setError] = useState("");

  const handleSetup = () => {
    if (!childName || !childAge) {
      setError("Please fill in all fields");
      return;
    }

    // Mock setup - go to parent PIN
    router.push("/(parent)/pin");
  };

  return (
    <ParentLayout>
      <View className="flex-1 justify-center">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-parent-primary mb-2">
            Add Child
          </Text>
          <Text className="text-text-secondary text-base">
            Let's set up your child's learning profile
          </Text>
        </View>

        <View className="gap-6 mb-8">
          <TextInput
            label="Child's Name"
            placeholder="Enter your child's name"
            value={childName}
            onChangeText={setChildName}
            error={error && !childName ? "Name is required" : ""}
          />
          <TextInput
            label="Child's Age"
            placeholder="e.g., 7"
            value={childAge}
            onChangeText={setChildAge}
            keyboardType="numeric"
            error={error && !childAge ? "Age is required" : ""}
          />
        </View>

        {error && (
          <Text className="text-child-danger text-center mb-6">{error}</Text>
        )}

        <ChildButton
          label="Continue"
          onPress={handleSetup}
          size="large"
        />

        <Pressable
          onPress={() => router.push("/(auth)/login")}
          className="mt-6"
        >
          <Text className="text-parent-accent text-center">
            Back to Login
          </Text>
        </Pressable>
      </View>
    </ParentLayout>
  );
}
