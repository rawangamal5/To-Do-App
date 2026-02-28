import { Tabs } from "expo-router";
import React from "react";
import "react-native-reanimated";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Splash Tab */}
      <Tabs.Screen
        name="splash"
        options={{ title: "Splash" }}
      />

      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
      />

      {/* Add Task Tab */}
      <Tabs.Screen
        name="create-task"
        options={{ title: "Add Task" }}
      />

      {/* Edit Task Tab */}
      <Tabs.Screen
        name="edit-task"
        options={{ title: "Edit Task" }}
      />
    </Tabs>
  );
}