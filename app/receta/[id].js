import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Image } from "expo-image";
import { getRecipeById } from "../../src/services/api";
import Comments from "../../src/components/Comments";
import { COLORS, SIZES } from "../../src/constants/theme";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!receta) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Receta no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: receta.name, headerTintColor: COLORS.coffee }} />
      
      <Image
        source={{ uri: receta.image }}
        style={styles.image}
        contentFit="cover"
        transition={500}
      />

      <View style={styles.panel}>
        <Text style={styles.title}>{receta.name}</Text>

        <View style={styles.metaContainer}>
          <Text style={styles.metaItem}><Text style={styles.bold}>Tiempo:</Text> {receta.cookTime} min</Text>
          <Text style={styles.metaItem}><Text style={styles.bold}>Porciones:</Text> {receta.servings}</Text>
          <Text style={styles.metaItem}><Text style={styles.bold}>Dificultad:</Text> {receta.difficulty}</Text>
          <Text style={styles.metaItem}><Text style={styles.bold}>Tipo:</Text> {receta.category}</Text>
        </View>

        <Text style={styles.descriptionLabel}>Descripción:</Text>
        <Text style={styles.description}>{receta.description}</Text>

        <Text style={styles.sectionTitle}>Ingredientes</Text>
        <View style={styles.list}>
          {receta.ingredients?.map((i, idx) => (
            <View key={idx} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{i}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Preparación</Text>
        <View style={styles.list}>
          {receta.instructions?.map((p, idx) => (
            <View key={idx} style={styles.listItem}>
              <Text style={styles.number}>{idx + 1}.</Text>
              <Text style={styles.listText}>{p}</Text>
            </View>
          ))}
        </View>
      </View>

      <Comments recipeId={id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.muted,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.danger,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: SIZES.radiusLg,
    marginBottom: 20,
  },
  panel: {
    backgroundColor: COLORS.paper,
    borderRadius: SIZES.radius,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginBottom: 16,
    textAlign: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  metaItem: {
    fontSize: 14,
    color: COLORS.ink,
  },
  bold: {
    fontWeight: 'bold',
  },
  descriptionLabel: {
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: COLORS.ink,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginTop: 8,
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.honey,
    alignSelf: 'flex-start',
  },
  list: {
    gap: 8,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    minWidth: 20,
  },
  listText: {
    fontSize: 15,
    color: COLORS.ink,
    flex: 1,
    lineHeight: 22,
  },
});
