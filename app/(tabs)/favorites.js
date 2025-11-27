import { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, Stack } from "expo-router";
import { AuthContext } from "../../src/store/authContext";
import { getUserFavorites } from "../../src/services/api";
import RecipeCard from "../../src/components/RecipeCard";
import { COLORS } from "../../src/constants/theme";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const { width } = useWindowDimensions();
  const numColumns = width > 600 ? 3 : 1;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const sectionTitleColor = useThemeColor({}, "text");
  const emptyTextColor = useThemeColor({}, "text");

  const headerBg = useThemeColor({}, "headerBackground");
  const headerText = useThemeColor({}, "headerText");

  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getUserFavorites(user.id);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando favoritos:", e);
      setErrorMsg("No se pudieron cargar tus favoritos.");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadFavorites();
      } else {
        setList([]);
        setLoading(false);
      }
    }, [user])
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.center}>
          <Text style={[styles.title, { color: textColor }]}>Favoritos</Text>
          <Text style={[styles.text, { color: textColor }]}>Inicia sesión para ver tus favoritos.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Usamos nuestro propio header visual, ocultamos el nativo */}
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              maxWidth: `${100 / numColumns}%`,
              padding: 8,
            }}
          >
            <RecipeCard receta={item} isFav={true} onFav={loadFavorites} />
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={[styles.headerRow, { backgroundColor: headerBg }]}>
              <Text style={[styles.appTitle, { color: headerText }]}>SUPER RECETARIO</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>Mis favoritos</Text>

            {loading && (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={styles.loader}
              />
            )}

            {errorMsg ? (
              <Text style={styles.error}>{errorMsg}</Text>
            ) : null}

            {!loading && !errorMsg && list.length === 0 && (
              <Text style={[styles.emptyText, { color: emptyTextColor }]}>Aún no tienes favoritos.</Text>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        numColumns={numColumns}
        key={numColumns}
        columnWrapperStyle={
          numColumns > 1 ? { justifyContent: "flex-start" } : undefined
        }
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  cardWrapper: {
    paddingHorizontal: 8,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },

  error: {
    color: COLORS.danger,
    textAlign: "center",
    marginTop: 8,
  },

  loader: {
    marginTop: 12,
  },
});
