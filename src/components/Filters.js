import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import { useThemeColor } from "../../hooks/useThemeColor";

const TIME = [
  { key: "15-30", label: "15-30" },
  { key: "30-45", label: "30-45" },
  { key: "45-60", label: "45-60" },
  { key: "60+",   label: "60+" },
];
const DIFF = ["fácil", "intermedio", "difícil"];
const TYPES = ["Desayuno", "Almuerzo", "Cena", "Snack"];
const RESTR = ["vegetariano", "sin lacteos", "sin gluten"];

export default function Filters({ value = {}, onChange, availableCategories = [], availableRestrictions = [] }) {
  const v = {
    time: value.time || [],
    difficulty: value.difficulty || [],
    type: value.type || [],
    restrictions: value.restrictions?.map(r => r.toLowerCase()) || [],
  };

  const titleColor = useThemeColor({}, "text");
  const sectionTitleColor = useThemeColor({}, "text");
  const chipBg = useThemeColor({}, "background");
  const chipBorder = useThemeColor({}, "borderColor");
  const chipText = useThemeColor({}, "text");
  const activeChipBg = useThemeColor({}, "tint");
  const activeChipText = useThemeColor({}, "background"); // Usually white or black depending on tint
  const clearColor = useThemeColor({}, "tint");

  const toggle = (group, key) => {
    const set = new Set(v[group]);
    set.has(key) ? set.delete(key) : set.add(key);
    onChange?.({ ...v, [group]: Array.from(set) });
  };

  const clearAll = () => onChange?.({ time: [], difficulty: [], type: [], restrictions: [] });

  const renderSection = (title, items, group, labelFn = (x) => x) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {items.map((item) => {
          const key = item.key || item;
          const label = item.label || labelFn(item);
          const isActive = v[group].includes(key);
          return (
            <Pressable
              key={key}
              style={[styles.chip, { backgroundColor: chipBg, borderColor: chipBorder }, isActive && { backgroundColor: activeChipBg, borderColor: activeChipBg }]}
              onPress={() => toggle(group, key)}
            >
              <Text style={[styles.chipText, { color: chipText }, isActive && { color: activeChipText }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: titleColor }]}>Filtros</Text>
        <Pressable onPress={clearAll}>
          <Text style={[styles.clear, { color: clearColor }]}>Limpiar</Text>
        </Pressable>
      </View>
      
      {renderSection("Tiempo", TIME, "time")}
      {renderSection("Dificultad", DIFF, "difficulty", (d) => d[0].toUpperCase() + d.slice(1))}
      {availableCategories.length > 0 && renderSection("Tipo", availableCategories, "type")}
      {availableRestrictions.length > 0 && renderSection("Restricciones", availableRestrictions, "restrictions", (r) => r[0].toUpperCase() + r.slice(1))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: COLORS.coffee, // Removed static color
  },
  clear: {
    // color: COLORS.primary, // Removed static color
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    // color: COLORS.muted, // Removed static color
    marginBottom: 4,
  },
  chips: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    // backgroundColor: COLORS.bg, // Removed static color
    borderWidth: 1,
    // borderColor: COLORS.honey, // Removed static color
  },
  chipActive: {
    // backgroundColor: COLORS.primary, // Removed static color
    // borderColor: COLORS.primary, // Removed static color
  },
  chipText: {
    fontSize: 12,
    // color: COLORS.ink, // Removed static color
  },
  chipTextActive: {
    // color: '#fff', // Removed static color
  },
});
