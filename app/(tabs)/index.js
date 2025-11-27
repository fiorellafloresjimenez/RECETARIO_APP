import { useEffect, useMemo, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import SearchBar from "../../src/components/SearchBar";
import Filters from "../../src/components/Filters";
import RecipeCard from "../../src/components/RecipeCard";
import { getRecipes, getUserFavorites } from "../../src/services/api";
import { AuthContext } from "../../src/store/authContext";
import { useTheme } from "../../src/store/themeContext";
import { COLORS } from "../../src/constants/theme";
import { useThemeColor } from "../../hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor({}, "background");
  const headerBg = useThemeColor({}, "headerBackground");
  const headerText = useThemeColor({}, "headerText");
  const filterPanelBg = useThemeColor({}, "cardBackground");
  const emptyTextColor = useThemeColor({}, "text");

  const { user, token } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [favIds, setFavIds] = useState([]);

  const { width } = useWindowDimensions();
  const numColumns = width > 900 ? 3 : 2;

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
        const ids = favs.map((r) => String(r.id));
        setFavIds(ids);
      } catch (e) {
        console.error("Error cargando favoritos:", e);
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
      list = list.filter(
        (r) =>
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
      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        key={numColumns}
        data={filtered}
        numColumns={numColumns}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              maxWidth: `${100 / numColumns}%`,
              padding: 8,
            }}
          >
            <RecipeCard
              receta={item}
              onFav={handleFavUpdate}
              isFav={favIds.includes(String(item.id))}
            />
          </View>
        )}
        columnWrapperStyle={
          numColumns > 1 ? { justifyContent: "flex-start" } : undefined
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={[styles.headerRow, { backgroundColor: headerBg }]}>
              <Text style={[styles.appTitle, { color: headerText }]}>SUPER RECETARIO</Text>
            </View>

            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={setQuery}
              placeholder="Buscar recetas o ingredientes"
              onFiltersPress={() => setShowFilters((prev) => !prev)}
            />

            {showFilters && (
              <View style={[styles.filterPanel, { backgroundColor: filterPanelBg }]}>
                <Filters 
                  value={filters} 
                  onChange={setFilters} 
                  availableCategories={Array.from(new Set(recipes.map(r => r.category).filter(Boolean))).sort()}
                  availableRestrictions={Array.from(new Set(recipes.flatMap(r => r.restrictions || []).filter(Boolean))).sort()}
                />
              </View>
            )}
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
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 26,
    marginBottom: 14,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  themeBtn: {
    padding: 4,
  },

  filterPanel: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignSelf: "center",                 // centrado horizontal
    width: "94%",                         // más suave visualmente
    marginTop: 10,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  center: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.muted,
  },
});
