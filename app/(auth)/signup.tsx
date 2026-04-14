import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TextInput } from "@/components/forms/TextInput";
import { ParentButton } from "@/components/buttons/ParentButton";
import { ParentLayout } from "@/components/layouts/ParentLayout";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = () => {
    let newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (
      !newErrors.name &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    ) {
      // Mock signup - go to child setup
      router.push("/(auth)/child-setup");
    }
  };

  return (
    <ParentLayout scrollable={true}>
      <View className="mb-8">
        <Text className="text-4xl font-bold text-parent-primary mb-2">
          Create Account
        </Text>
        <Text className="text-text-secondary text-base">
          Set up your parent account
        </Text>
      </View>

      <View className="gap-6 mb-8">
        <TextInput
          label="Full Name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <TextInput
          label="Email Address"
          placeholder="parent@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          error={errors.email}
        />
        <TextInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />
        <TextInput
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
        />
      </View>

      <ParentButton
        label="Create Account"
        onPress={handleSignup}
        size="large"
      />

      <View className="flex-row justify-center gap-2 mt-6">
        <Text className="text-text-secondary">Already have an account?</Text>
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text className="text-parent-accent font-semibold">Sign in</Text>
        </Pressable>
      </View>
    </ParentLayout>
  );
}
