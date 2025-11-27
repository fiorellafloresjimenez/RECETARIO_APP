import { useEffect, useState, useContext, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../src/store/authContext";
import { getRecipes, deleteRecipe } from "../../src/services/api";
import { COLORS, SIZES } from "../../src/constants/theme";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function AdminIndex() {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const textLightColor = useThemeColor({}, "textLight");
  const borderColor = useThemeColor({}, "borderColor");
  const inputBg = useThemeColor({}, "inputBackground");
  const placeholderColor = useThemeColor({}, "placeholderText");
  const headerBg = useThemeColor({}, "headerBackground");
  const headerText = useThemeColor({}, "headerText");
  const btnPrimary = useThemeColor({}, "buttonPrimary");

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

  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return recipes;
    const q = searchQuery.toLowerCase();
    return recipes.filter(r => r.name.toLowerCase().includes(q));
  }, [recipes, searchQuery]);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.info}>
        <Text style={[styles.name, { color: textColor }]}>{item.name}</Text>
        <Text style={[styles.category, { color: textLightColor }]}>{item.category}</Text>
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
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: cardBg, borderColor }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.title, { color: textColor }]}>Administrar Recetas</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: inputBg, borderColor }]}>
        <Ionicons name="search" size={20} color={placeholderColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Buscar receta..."
          placeholderTextColor={placeholderColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={placeholderColor} />
          </Pressable>
        ) : null}
      </View>

      <Pressable 
        style={[styles.createBtn, { backgroundColor: btnPrimary }]} 
        onPress={() => router.push("/admin/form")}
      >
        <Text style={styles.createBtnText}>+ Nueva Receta</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color={btnPrimary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={[styles.empty, { color: textLightColor }]}>No se encontraron recetas.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  createBtn: {
    margin: 16,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SIZES.shadow,
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
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnEdit: {
    backgroundColor: COLORS.accent,
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
    marginTop: 20,
  },
});
