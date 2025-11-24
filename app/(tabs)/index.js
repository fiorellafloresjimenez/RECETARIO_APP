import { useEffect, useMemo, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import SearchBar from "../../src/components/SearchBar";
import Filters from "../../src/components/Filters";
import RecipeCard from "../../src/components/RecipeCard";
import { getRecipes, getUserFavorites } from "../../src/services/api";
import { AuthContext } from "../../src/store/authContext";
import { COLORS, SIZES } from "../../src/constants/theme";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const [favIds, setFavIds] = useState([]);
  const { width } = useWindowDimensions();

  const numColumns = width > 600 ? 3 : 1;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getRecipes(token);
        setRecipes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando recetas:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const loadFavs = async () => {
    if (user && token) {
      try {
        const favs = await getUserFavorites(user.id, token);
        const ids = favs.map(r => String(r.id));
        setFavIds(ids);
      } catch (e) {
        console.error("Error loading favs:", e);
      }
    } else {
      setFavIds([]);
    }
  };

  useEffect(() => {
    loadFavs();
  }, [user, token]);

  const filtered = useMemo(() => {
    let list = recipes;
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter((r) =>
        r.name?.toLowerCase().includes(q) ||
        r.ingredients?.some?.((i) => i.toLowerCase().includes(q))
      );
    }

    if (filters.time?.length) {
      list = list.filter((r) => {
        const t = Number(r.cookTime);
        return filters.time.some((f) => {
          if (f === "15-30") return t >= 15 && t <= 30;
          if (f === "30-45") return t > 30 && t <= 45;
          if (f === "45-60") return t > 45 && t <= 60;
          if (f === "60+") return t > 60;
          return true;
        });
      });
    }

    if (filters.difficulty?.length) {
      list = list.filter((r) =>
        filters.difficulty.includes(String(r.difficulty).toLowerCase())
      );
    }

    if (filters.type?.length) {
      list = list.filter((r) => filters.type.includes(r.category));
    }

    if (filters.restrictions?.length) {
      list = list.filter((r) =>
        filters.restrictions.every((s) => r.restrictions?.includes?.(s))
      );
    }

    return list;
  }, [recipes, query, filters]);

  const handleFavUpdate = async () => {
    await loadFavs();
  };

  const renderEmpty = () => (
    <View style={styles.center}>
      <Text style={styles.emptyText}>
        {loading ? "Cargando recetas..." : "No se encontraron recetas"}
      </Text>
      {loading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 16 }} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        key={numColumns}
        data={filtered}
        numColumns={numColumns}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ flex: 1, maxWidth: numColumns > 1 ? `${100 / numColumns}%` : '100%', padding: 8 }}>
            <RecipeCard
              receta={item}
              onFav={handleFavUpdate}
              isFav={favIds.includes(String(item.id))}
            />
          </View>
        )}
        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'flex-start' } : undefined}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.appTitle}>Super Recetario</Text>
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={setQuery}
              placeholder="Buscar recetas..."
            />
            <Filters value={filters} onChange={setFilters} />
          </View>
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  headerContainer: {
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginBottom: 16,
    textAlign: 'center',
  },
  center: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.muted,
  },
});
