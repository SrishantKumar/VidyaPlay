import React from "react";
import { View, ScrollView, SafeAreaView, StatusBar } from "react-native";

interface ParentLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const ParentLayout: React.FC<ParentLayoutProps> = ({
  children,
  scrollable = true,
}) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView className="flex-1 bg-bg-light">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <Container className="flex-1">
        <View className="p-6">{children}</View>
      </Container>
    </SafeAreaView>
  );
};
