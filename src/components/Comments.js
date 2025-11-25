import { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { AuthContext } from "../store/authContext";
import { getComments, addComment, deleteComment } from "../services/api";
import { COLORS, SIZES } from "../constants/theme";

export default function Comments({ recipeId }) {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const canComment = Boolean(user && user.id);

  const loadComments = async () => {
    if (!recipeId) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getComments(String(recipeId));
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setErrorMsg("No se pudieron cargar los comentarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [recipeId]);

  const handleSubmit = async () => {
    if (!canComment) return;

    const text = content.trim();
    if (!text) return;

    setPosting(true);
    try {
      await addComment(String(recipeId), {
        content: text,
        userId: user.id,
      });
      setContent("");
      await loadComments();
    } catch (err) {
      console.error("Error creando comentario:", err);
      Alert.alert("Error", "No se pudo publicar el comentario.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!canComment) return;
    
    Alert.alert(
      "Confirmar",
      "¿Eliminar este comentario?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            setDeletingId(commentId);
            try {
              await deleteComment(String(commentId), user.id);
              await loadComments();
            } catch (err) {
              console.error("Error eliminando comentario:", err);
              Alert.alert("Error", "No se pudo eliminar el comentario.");
            } finally {
              setDeletingId(null);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comentarios</Text>

      {canComment ? (
        <View style={styles.form}>
          <Text style={styles.label}>Escribe un comentario</Text>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            placeholder="Comparte tu opinión o tips sobre esta receta…"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <View style={styles.btnContainer}>
            <Pressable
              style={[styles.btn, posting && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={posting}
            >
              <Text style={styles.btnText}>
                {posting ? "Publicando…" : "Publicar comentario"}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={styles.mutedText}>
          Inicia sesión para dejar un comentario.
        </Text>
      )}

      {loading && <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 16 }} />}
      
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      {!loading && !errorMsg && items.length === 0 && (
        <Text style={[styles.mutedText, { marginTop: 16 }]}>
          Aún no hay comentarios. ¡Sé la primera persona en comentar! 🍽️
        </Text>
      )}

      {!loading && !errorMsg && items.length > 0 && (
        <View style={styles.list}>
          {items.map((c) => {
            const author = c.users?.username || "Usuario";
            const isOwner = user && user.id && c.users?.id === user.id;
            const date = c.created_at
              ? new Date(c.created_at).toLocaleString()
              : "";

            return (
              <View key={c.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.author}>{author}</Text>
                  <Text style={styles.date}>{date}</Text>
                </View>
                <Text style={styles.commentContent}>{c.content}</Text>
                {isOwner && (
                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                  >
                    <Text style={styles.deleteText}>
                      {deletingId === c.id ? "Eliminando…" : "Eliminar"}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: SIZES.radius,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginBottom: 16,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.ink,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.honey,
    borderRadius: SIZES.radius,
    padding: 12,
    minHeight: 80,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  btnContainer: {
    alignItems: 'flex-end',
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  mutedText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.danger,
    marginVertical: 8,
  },
  list: {
    gap: 12,
  },
  commentItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  author: {
    fontWeight: 'bold',
    color: COLORS.coffee,
    fontSize: 14,
  },
  date: {
    fontSize: 11,
    color: COLORS.muted,
  },
  commentContent: {
    fontSize: 14,
    color: COLORS.ink,
    marginBottom: 4,
  },
  deleteBtn: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  deleteText: {
    color: COLORS.danger,
    fontSize: 12,
  },
});
