import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { getRecipeById } from "../../src/services/api";
import Comments from "../../src/components/Comments";
import { COLORS, SIZES, SHADOWS } from "../../src/constants/theme";
import { useThemeColor } from "../../hooks/useThemeColor";

// Colores para los chips de restricciones (mismo criterio que en las tarjetas)
const getTagColors = (tag) => {
  const key = (tag || "").toLowerCase().trim();

  if (key.includes("vegano") || key.includes("vegan")) {
    return { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" };
  }
  if (key.includes("vegetar")) {
    return { bg: "#FFFDE7", text: "#F9A825", border: "#FFF59D" };
  }
  if (key.includes("gluten")) {
    return { bg: "#E3F2FD", text: "#1565C0", border: "#90CAF9" };
  }
  if (key.includes("lactosa") || key.includes("dairy")) {
    return { bg: "#FCE4EC", text: "#AD1457", border: "#F48FB1" };
  }

  return { bg: COLORS.bg, text: COLORS.muted, border: COLORS.honey };
};

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const headerBg = useThemeColor({}, "headerBackground");
  const headerText = useThemeColor({}, "headerText");
  const sectionTitleColor = useThemeColor({}, "sectionTitle");
  const metaLabelColor = useThemeColor({}, "text"); // or muted
  const metaValueColor = useThemeColor({}, "text");
  const descriptionColor = useThemeColor({}, "text");
  const listTextColor = useThemeColor({}, "text");
  const emptyTextColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "borderColor");
  const stepNumberColor = useThemeColor({}, "primary");

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipeById(id);
        setReceta(data);
      } catch (e) {
        console.error("Error cargando receta:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={styles.loadingText}>Cargando…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!receta) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor }]}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Receta no encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const restrictions = Array.isArray(receta.restrictions)
    ? receta.restrictions
    : [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <View style={styles.headerContainer}>
        <View style={[styles.headerRow, { backgroundColor: headerBg }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={headerText} />
          </Pressable>
          <Text style={[styles.appTitle, { color: headerText }]}>SUPER RECETARIO</Text>
        </View>
      </View>

      <ScrollView
        style={[styles.screen, { backgroundColor }]}
        contentContainerStyle={styles.screenContent}
      >
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          {/* Imagen */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: receta.image }}
              style={styles.image}
              contentFit="cover"
              transition={500}
            />
          </View>

          {/* Panel beige */}
          <View style={styles.body}>
            {/* Título */}
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
                {receta.name}
              </Text>
            </View>

            {/* Meta: duración, dificultad, tipo, porciones */}
            <View style={styles.metaGrid}>
              <View style={styles.metaColumn}>
                <Text style={[styles.metaLabel, { color: metaLabelColor }]}>Duración</Text>
                <Text style={[styles.metaValue, { color: metaValueColor }]}>{receta.cookTime} min</Text>
              </View>
              <View style={styles.metaColumn}>
                <Text style={[styles.metaLabel, { color: metaLabelColor }]}>Dificultad</Text>
                <Text style={[styles.metaValue, { color: metaValueColor }]}>{receta.difficulty}</Text>
              </View>
              <View style={styles.metaColumn}>
                <Text style={[styles.metaLabel, { color: metaLabelColor }]}>Tipo</Text>
                <Text style={[styles.metaValue, { color: metaValueColor }]}>{receta.category}</Text>
              </View>
              <View style={styles.metaColumn}>
                <Text style={[styles.metaLabel, { color: metaLabelColor }]}>Porciones</Text>
                <Text style={[styles.metaValue, { color: metaValueColor }]}>{receta.servings}</Text>
              </View>
            </View>

            {/* Descripción */}
            {receta.description ? (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>Descripción</Text>
                <Text style={[styles.description, { color: descriptionColor }]}>{receta.description}</Text>
              </View>
            ) : null}

            {/* Chips de restricciones */}
            {restrictions.length > 0 && (
              <View style={[styles.section, styles.tagsSection]}>
                <Text style={[styles.sectionTitle, { marginBottom: 4, color: sectionTitleColor }]}>
                  Etiquetas
                </Text>
                <View style={styles.tagsContainer}>
                  {restrictions.map((tag, index) => {
                    const { bg, text, border } = getTagColors(tag);
                    return (
                      <View
                        key={`${tag}-${index}`}
                        style={[
                          styles.tag,
                          {
                            backgroundColor: bg,
                            borderColor: border,
                          },
                        ]}
                      >
                        <Text style={[styles.tagText, { color: text }]}>
                          {tag}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Ingredientes */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>Ingredientes</Text>
              {Array.isArray(receta.ingredients) &&
              receta.ingredients.length > 0 ? (
                <View style={styles.list}>
                  {receta.ingredients.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={[styles.listText, { color: listTextColor }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: emptyTextColor }]}>
                  No se registraron ingredientes.
                </Text>
              )}
            </View>

            {/* Instrucciones */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>Instrucciones</Text>
              {Array.isArray(receta.instructions) &&
              receta.instructions.length > 0 ? (
                <View style={styles.list}>
                  {receta.instructions.map((step, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={[styles.stepNumber, { color: listTextColor }]}>{index + 1}.</Text>
                      <Text style={[styles.listText, { color: listTextColor }]}>{step}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: emptyTextColor }]}>
                  No se registraron instrucciones.
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Comentarios (con espacio inferior extra para que no los tape el tab bar) */}
        <View style={styles.commentsWrapper}>
          <Comments recipeId={id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // backgroundColor: COLORS.seaBlue, // Removed static color
  },
  screen: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.paper,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.paper,
    fontWeight: "600",
  },

  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 26,
    marginBottom: 14,
  },
  backBtn: {
    marginRight: 12,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },

  card: {
    // backgroundColor: COLORS.paper, // Removed static color
    borderRadius: SIZES.radiusLg,
    overflow: "hidden",
    ...SHADOWS.default,
  },
  imageWrapper: {
    backgroundColor: COLORS.secondary,
  },
  image: {
    width: "100%",
    height: 230,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    // color: COLORS.coffee, // Removed static color
  },

  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    paddingBottom: 10,
    marginBottom: 12,
  },
  metaColumn: {
    width: "48%",
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 12,
    // color: COLORS.muted, // Removed static color
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "600",
    // color: COLORS.ink, // Removed static color
  },

  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    // color: COLORS.coffee, // Removed static color
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    // color: COLORS.ink, // Removed static color
  },
  emptyText: {
    fontSize: 13,
    // color: COLORS.muted, // Removed static color
    fontStyle: "italic",
  },

  list: {
    gap: 6,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 8,
  },
  bullet: {
    fontSize: 16,
    marginTop: 1,
    color: COLORS.accent,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "right",
    marginTop: 1,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.ink,
  },

  // Chips de restricciones
  tagsSection: {
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },

  commentsWrapper: {
    marginTop: 24,
  },
});
