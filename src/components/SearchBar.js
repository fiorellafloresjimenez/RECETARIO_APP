import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  onFiltersPress,
}) {
  const [local, setLocal] = useState(value || "");

  const containerBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "text"); // Or muted
  const filterBtnBg = useThemeColor({}, "tint");
  const filterIconColor = useThemeColor({}, "background");

  const handleSubmit = () => {
    onSubmit?.(local);
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: containerBg }]}>
        <Ionicons
          name="search"
          size={20}
          color={iconColor}
          style={styles.leftIcon}
        />

        <TextInput
          style={[styles.input, { color: textColor }]}
          value={local}
          onChangeText={(t) => {
            setLocal(t);
            onChange?.(t);
          }}
          placeholder={placeholder}
          placeholderTextColor={iconColor}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
        />

        <Pressable
          style={[styles.filterBtn, { backgroundColor: filterBtnBg }]}
          onPress={onFiltersPress}
          disabled={!onFiltersPress}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={filterIconColor} // ICONO BEIGE
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 44,
  },
  leftIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
