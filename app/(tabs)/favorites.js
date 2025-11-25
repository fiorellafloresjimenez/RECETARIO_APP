import { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { AuthContext } from "../../src/store/authContext";
import { getUserFavorites } from "../../src/services/api";
import RecipeCard from "../../src/components/RecipeCard";
import { COLORS, SIZES } from "../../src/constants/theme";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
      <View style={styles.center}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.text}>Inicia sesión para ver tus favoritos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mis Favoritos</Text>
      
      {loading && <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />}
      
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      
      {!loading && !errorMsg && list.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.text}>Aún no tienes favoritos.</Text>
        </View>
      )}

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RecipeCard
            receta={item}
            isFav={true}
            onFav={loadFavorites}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: COLORS.muted,
  },
  error: {
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  loader: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
});
