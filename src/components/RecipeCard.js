import { useState, useContext } from "react";
import { View, Text, Pressable, StyleSheet, Alert, Linking } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/authContext";
import { addFavorite, removeFavorite } from "../services/api";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";
import { useThemeColor } from "../../hooks/useThemeColor";

const capitalize = (s) =>
  typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s;

const getTagColors = (tag) => {
  const key = (tag || "").toLowerCase().trim();
  if (key.includes("vegano") || key.includes("vegan")) {
    return {
      bg: "#E8F5E9",
      text: "#2E7D32",
      border: "#A5D6A7",
    };
  }

  if (key.includes("vegetar")) {
    return {
      bg: "#FFF3E0",
      text: "#EF6C00",
      border: "#FFCC80",
    };
  }

  if (key.includes("gluten")) {
    return {
      bg: "#E3F2FD",
      text: "#1565C0",
      border: "#90CAF9",
    };
  }

  if (key.includes("lactosa") || key.includes("dairy")) {
    return {
      bg: "#FCE4EC",
      text: "#AD1457",
      border: "#F48FB1",
    };
  }

  // Por defecto
  return {
    bg: COLORS.bg,
    text: COLORS.muted,
    border: COLORS.honey,
  };
};

export default function RecipeCard({ receta, isFav: initialFav, onFav }) {
  const { user } = useContext(AuthContext);
  const [isFav, setIsFav] = useState(initialFav);

  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "borderColor");

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
    const url = `${
      process.env.EXPO_PUBLIC_API_BASE ||
      "https://recetario-app-backend.onrender.com"
    }/rdf/${receta.id}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No se puede abrir el enlace: " + url);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      {/* Imagen + icono de favorito */}
      <View style={styles.imageWrapper}>
        <Link href={`/receta/${receta.id}`} asChild>
          <Pressable>
            <Image
              source={{ uri: receta.image }}
              style={styles.image}
              contentFit="cover"
            />
          </Pressable>
        </Link>

        <Pressable style={styles.favoriteIcon} onPress={handleFav}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={22}
            color={isFav ? tintColor : textColor}
          />
        </Pressable>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Link href={`/receta/${receta.id}`} asChild>
          <Pressable>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
              {receta.name}
            </Text>
          </Pressable>
        </Link>

        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.bold}>Tiempo:</Text> {receta.cookTime} min
        </Text>

        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.bold}>Dificultad:</Text>{" "}
          {capitalize(receta.difficulty)}
        </Text>

        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.bold}>Tipo:</Text> {receta.category}
        </Text>

        {receta.restrictions?.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={[styles.text, styles.bold, { color: textColor }]}>Etiquetas:</Text>
            {receta.restrictions.map((tag, idx) => {
              const { bg, text, border } = getTagColors(tag);
              return (
                <View
                  key={idx}
                  style={[
                    styles.tag,
                    { backgroundColor: bg, borderColor: border },
                  ]}
                >
                  <Text style={[styles.tagText, { color: text }]}>
                    {capitalize(tag)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Botón RDF (solo texto, sin botón de favorito extra) */}
        <View style={styles.actions}>
          <Pressable
            style={[styles.btn, styles.btnOutline, { borderColor: tintColor }]}
            onPress={handleDownloadRDF}
          >
            <Text style={[styles.btnText, styles.btnOutlineText, { color: tintColor }]}>
              Descargar RDF
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radius,
    marginBottom: 16,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160, // ajusta si quieres la card más o menos alta
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    padding: 6,
    ...SHADOWS.sm,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    marginBottom: 3,
  },
  bold: {
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  btnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  btnOutlineText: {
  },
});
