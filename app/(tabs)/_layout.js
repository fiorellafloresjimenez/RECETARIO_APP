// app/(tabs)/_layout.js
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../src/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,

        // TAB BAR RECTANGULAR PEGADA AL BORDE INFERIOR
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 70,
          backgroundColor: COLORS.cream,
          borderTopWidth: 0,

          // ❗ anulamos el padding automático del safe area
          paddingTop: 0,
          paddingBottom: 0,

          margin: 0,
          borderRadius: 0,
          overflow: "hidden",
          elevation: 8,
        },

        // centramos el contenido de cada item
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bookmark" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Cuenta",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
