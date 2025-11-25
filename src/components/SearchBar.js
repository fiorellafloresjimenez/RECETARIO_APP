// src/components/SearchBar.js
import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  onFiltersPress,
}) {
  const [local, setLocal] = useState(value || "");

  const handleSubmit = () => {
    onSubmit?.(local);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.muted}
          style={styles.leftIcon}
        />

        <TextInput
          style={styles.input}
          value={local}
          onChangeText={(t) => {
            setLocal(t);
            onChange?.(t);
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.muted}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
        />

        <Pressable
          style={styles.filterBtn}
          onPress={onFiltersPress}
          disabled={!onFiltersPress}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={COLORS.honey} // ICONO BEIGE
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
    backgroundColor: COLORS.cream,
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
    color: COLORS.text,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.seaBlue, // BOTÓN AZUL
  },
});
