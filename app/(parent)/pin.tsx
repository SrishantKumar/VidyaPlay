import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { ParentLayout } from "@/components/layouts/ParentLayout";
import { PINInput } from "@/components/forms/PINInput";
import { mockParent } from "@/constants/mockData";

export default function PINScreen() {
  const router = useRouter();

  const handlePINComplete = (enteredPin: string) => {
    // Mock PIN validation
    if (enteredPin === mockParent.pin) {
      router.push("/(parent)/dashboard");
    } else {
      alert("Incorrect PIN. Please try again.");
    }
  };

  return (
    <ParentLayout scrollable={false}>
      <View className="flex-1 justify-between">
        <View />
        
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-parent-primary mb-2">
            Enter PIN
          </Text>
          <Text className="text-text-secondary text-center">
            Enter your PIN to access the parent dashboard
          </Text>
        </View>

        <PINInput onComplete={handlePINComplete} length={4} />

        <View className="mb-8">
          <Text className="text-center text-text-secondary text-sm">
            Demo PIN: 1234
          </Text>
        </View>
      </View>
    </ParentLayout>
  );
}
