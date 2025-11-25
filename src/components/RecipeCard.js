import { useState, useContext } from "react";
import { View, Text, Pressable, StyleSheet, Alert, Linking } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { AuthContext } from "../store/authContext";
import { addFavorite, removeFavorite } from "../services/api";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";

const capitalize = (s) =>
  typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s;

export default function RecipeCard({ receta, isFav: initialFav, onFav }) {
  const { user } = useContext(AuthContext);
  const [isFav, setIsFav] = useState(initialFav);

  const handleFav = async () => {
    if (!user) {
      Alert.alert("Atención", "Debes iniciar sesión para usar favoritos");
      return;
    }
    try {
      if (isFav) {
        await removeFavorite(user.id, receta.id);
        setIsFav(false);
        Alert.alert("Éxito", "Se quitó de favoritos");
      } else {
        await addFavorite(user.id, receta.id);
        setIsFav(true);
        Alert.alert("Éxito", "Se guardó en favoritos");
      }
      onFav && (await onFav());
    } catch (e) {
      console.error("Error al actualizar favorito:", e);
      Alert.alert("Error", "No se pudo actualizar favoritos");
    }
  };

  const handleDownloadRDF = async () => {
    const url = `${process.env.EXPO_PUBLIC_API_BASE || "https://recetario-app-backend.onrender.com"}/rdf/${receta.id}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No se puede abrir el enlace: " + url);
    }
  };

  return (
    <View style={styles.card}>
      <Link href={`/receta/${receta.id}`} asChild>
        <Pressable>
          <Image
            source={{ uri: receta.image }}
            style={styles.image}
            contentFit="cover"
          />
        </Pressable>
      </Link>
      <View style={styles.content}>
        <Link href={`/receta/${receta.id}`} asChild>
          <Pressable>
            <Text style={styles.title}>{receta.name}</Text>
          </Pressable>
        </Link>
        <Text style={styles.text}>
          <Text style={styles.bold}>Tiempo:</Text> {receta.cookTime} min
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Dificultad:</Text> {capitalize(receta.difficulty)}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Tipo:</Text> {receta.category}
        </Text>
        
        {receta.restrictions?.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={[styles.text, styles.bold]}>Etiquetas:</Text>
            {receta.restrictions.map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{capitalize(tag)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Pressable 
            style={[styles.btn, isFav ? styles.btnOutline : styles.btnPrimary]} 
            onPress={handleFav}
          >
            <Text style={[styles.btnText, isFav ? styles.btnOutlineText : styles.btnPrimaryText]}>
              {isFav ? "Quitar de Favoritos" : "Favorito"}
            </Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnOutline]} onPress={handleDownloadRDF}>
            <Text style={[styles.btnText, styles.btnOutlineText]}>Descargar RDF</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.paper,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: COLORS.ink,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.honey,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  btnPrimaryText: {
    color: '#fff',
  },
  btnOutlineText: {
    color: COLORS.primary,
  },
});
