import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0f0c29" }, // Header color
        headerTintColor: "#ffffff", // Header text color
        tabBarStyle: { backgroundColor: "#0f0c29" }, // Bottom tab color
        tabBarActiveTintColor: "#ffffff", // Active tab icon/text color
        tabBarInactiveTintColor: "#c1c1c1", // Inactive tab icon/text color
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle:"AI-ImagineApp",
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="previous"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
