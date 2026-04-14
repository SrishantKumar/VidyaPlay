import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TextInput } from "@/components/forms/TextInput";
import { ParentButton } from "@/components/buttons/ParentButton";
import { ParentLayout } from "@/components/layouts/ParentLayout";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleLogin = () => {
    let newErrors = { email: "", password: "" };

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      // Mock login - navigate to parent PIN
      router.push("/(parent)/pin");
    }
  };

  return (
    <ParentLayout>
      <View className="flex-1 justify-center">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-parent-primary mb-2">
            Welcome Back
          </Text>
          <Text className="text-text-secondary text-base">
            Sign in to your account
          </Text>
        </View>

        <View className="gap-6 mb-8">
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
        </View>

        <ParentButton
          label="Sign In"
          onPress={handleLogin}
          size="large"
        />

        <View className="flex-row justify-center gap-2 mt-6">
          <Text className="text-text-secondary">Don't have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-parent-accent font-semibold">Sign up</Text>
          </Pressable>
        </View>

        <Pressable className="mt-8">
          <Text className="text-parent-accent text-center">
            Forgot password?
          </Text>
        </Pressable>
      </View>
    </ParentLayout>
  );
}
