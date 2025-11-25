import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AdminRecipeForm from "../../src/components/AdminRecipeForm";
import { AuthContext } from "../../src/store/authContext";
import { getRecipes, createRecipe, updateRecipe } from "../../src/services/api";
import { COLORS } from "../../src/constants/theme";

export default function AdminForm() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const recipes = await getRecipes(token);
          const found = recipes.find((r) => String(r.id) === String(id));
          if (found) {
            setInitialData(found);
          } else {
            Alert.alert("Error", "Receta no encontrada");
            router.back();
          }
        } catch (e) {
          Alert.alert("Error", "Error cargando receta");
          router.back();
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, token]);

  const handleSubmit = async (data) => {
    try {
      if (id) {
        await updateRecipe(id, data, token);
        Alert.alert("Éxito", "Receta actualizada");
      } else {
        await createRecipe(data, token);
        Alert.alert("Éxito", "Receta creada");
      }
      router.back();
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar la receta: " + e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{id ? "Editar Receta" : "Nueva Receta"}</Text>
      </View>
      <AdminRecipeForm 
        initial={initialData} 
        onSubmit={handleSubmit} 
        onCancel={() => router.back()} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.coffee,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
