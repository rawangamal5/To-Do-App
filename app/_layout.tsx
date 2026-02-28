// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { TasksProvider } from "./TasksContext";

export default function RootLayout() {
  return (
    <TasksProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />      
        <Stack.Screen name="(tabs)" />      
        <Stack.Screen name="edit-task" />   
      </Stack>
      <StatusBar style="auto" />
    </TasksProvider>
  );
}