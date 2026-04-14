import React from "react";
import { View, ScrollView, SafeAreaView, StatusBar, Platform, StyleSheet } from "react-native";

interface ChildLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const ChildLayout: React.FC<ChildLayoutProps> = ({
  children,
  scrollable = true,
}) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView className="flex-1 bg-child-surface">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <View style={styles.webContainer}>
        <Container 
          className="flex-1"
          contentContainerStyle={scrollable ? { flexGrow: 1 } : undefined}
        >
          <View className="p-6">{children}</View>
        </Container>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 480 : undefined,
    alignSelf: "center",
    backgroundColor: "#fff",
    // Premium shadow for web mobile-view
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
});

