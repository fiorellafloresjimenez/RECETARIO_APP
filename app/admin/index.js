import { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../src/store/authContext";
import { getRecipes, deleteRecipe } from "../../src/services/api";
import { COLORS, SIZES } from "../../src/constants/theme";

export default function AdminIndex() {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await getRecipes(token);
      setRecipes(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Error", "No se pudieron cargar las recetas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [token]);

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de eliminar esta receta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipe(id, token);
              loadRecipes();
            } catch (e) {
              Alert.alert("Error", "No se pudo eliminar la receta");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable 
          style={[styles.btn, styles.btnEdit]} 
          onPress={() => router.push({ pathname: "/admin/form", params: { id: item.id } })}
        >
          <Text style={styles.btnText}>Editar</Text>
        </Pressable>
        <Pressable 
          style={[styles.btn, styles.btnDelete]} 
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.btnText}>Borrar</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </Pressable>
        <Text style={styles.title}>Administrar Recetas</Text>
      </View>

      <Pressable 
        style={styles.createBtn} 
        onPress={() => router.push("/admin/form")}
      >
        <Text style={styles.createBtnText}>+ Nueva Receta</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay recetas aún.</Text>}
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.coffee,
  },
  createBtn: {
    margin: 16,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SIZES.shadow,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.coffee,
  },
  category: {
    fontSize: 14,
    color: COLORS.muted,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnEdit: {
    backgroundColor: COLORS.honey,
  },
  btnDelete: {
    backgroundColor: COLORS.danger,
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 20,
  },
});
