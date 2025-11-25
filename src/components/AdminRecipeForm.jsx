import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { COLORS, SIZES } from "../constants/theme";

const DIFFICULTIES = ["Fácil", "Intermedio", "Difícil"];

export default function AdminRecipeForm({ initial = null, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [cookTime, setCookTime] = useState(initial?.cookTime ? String(initial.cookTime) : "");
  const [servings, setServings] = useState(initial?.servings ? String(initial.servings) : "1");
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? "Intermedio");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [ingredients, setIngredients] = useState(initial?.ingredients ?? []);
  const [instructions, setInstructions] = useState(initial?.instructions ?? []);
  const [restrictions, setRestrictions] = useState(initial?.restrictions ?? []);
  const [error, setError] = useState("");

  const [ingInput, setIngInput] = useState("");
  const [instInput, setInstInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => { setError(""); }, [name, description, image, cookTime, servings, difficulty, category, ingredients, instructions, restrictions]);

  const payload = useMemo(() => ({
    name, description, image, 
    cookTime: Number(cookTime), 
    servings: Number(servings), 
    difficulty, category,
    ingredients, instructions, restrictions,
  }), [name, description, image, cookTime, servings, difficulty, category, ingredients, instructions, restrictions]);

  const handleAddToList = (setter, value, inputSetter) => {
    const v = value.trim();
    if (!v) return;
    setter((prev) => [...prev, v]);
    inputSetter("");
  };

  const handleRemoveFromList = (setter, idx) => {
    setter((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImageBlur = () => {
    if (image && !image.startsWith("http") && !image.startsWith("/")) {
      // Assume it's a filename
      setImage(`/assets/images/recipes/${image}`);
    }
  };

  const validate = () => {
    if (!name.trim()) return "El nombre es obligatorio";
    if (!description.trim()) return "La descripción es obligatoria";
    if (!Number.isFinite(Number(cookTime)) || Number(cookTime) < 0) return "Tiempo de cocción inválido";
    if (!Number.isFinite(Number(servings)) || Number(servings) <= 0) return "Porciones inválidas";
    if (!DIFFICULTIES.includes(difficulty)) return "Dificultad inválida";
    if (ingredients.length === 0) return "Agrega al menos un ingrediente";
    if (instructions.length === 0) return "Agrega al menos un paso";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { 
        setError(err); 
        Alert.alert("Error", err);
        return; 
    }
    await onSubmit?.(payload);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.group}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Nombre de la receta" 
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput 
            style={[styles.input, styles.textArea]} 
            value={description} 
            onChangeText={setDescription} 
            placeholder="Describe la receta" 
            multiline 
            numberOfLines={3}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Imagen (URL)</Text>
        <TextInput 
            style={styles.input} 
            value={image} 
            onChangeText={setImage} 
            onBlur={handleImageBlur}
            placeholder="https://... o nombre.jpg" 
        />
        <Text style={styles.helperText}>Dejar vacío para usar la imagen por defecto basada en el ID.</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.group, { flex: 1 }]}>
            <Text style={styles.label}>Tiempo (min)</Text>
            <TextInput 
                style={styles.input} 
                value={cookTime} 
                onChangeText={setCookTime} 
                keyboardType="numeric"
            />
        </View>
        <View style={[styles.group, { flex: 1 }]}>
            <Text style={styles.label}>Porciones</Text>
            <TextInput 
                style={styles.input} 
                value={servings} 
                onChangeText={setServings} 
                keyboardType="numeric"
            />
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Dificultad</Text>
        <View style={styles.pills}>
            {DIFFICULTIES.map((d) => (
                <Pressable 
                    key={d} 
                    style={[styles.pill, difficulty === d && styles.pillActive]}
                    onPress={() => setDifficulty(d)}
                >
                    <Text style={[styles.pillText, difficulty === d && styles.pillTextActive]}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                    </Text>
                </Pressable>
            ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Categoría</Text>
        <TextInput 
            style={styles.input} 
            value={category} 
            onChangeText={setCategory} 
            placeholder="Postre, Plato principal..." 
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Ingredientes</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            value={ingInput} 
            onChangeText={setIngInput} 
            placeholder="Agregar ingrediente" 
          />
          <Pressable style={styles.btnAdd} onPress={() => handleAddToList(setIngredients, ingInput, setIngInput)}>
            <Text style={styles.btnAddText}>+</Text>
          </Pressable>
        </View>
        {ingredients.map((ing, idx) => (
            <View key={idx} style={styles.listItem}>
                <Text style={styles.listText}>{idx + 1}. {ing}</Text>
                <Pressable onPress={() => handleRemoveFromList(setIngredients, idx)}>
                    <Text style={styles.removeText}>✕</Text>
                </Pressable>
            </View>
        ))}
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Pasos</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            value={instInput} 
            onChangeText={setInstInput} 
            placeholder="Agregar paso" 
          />
          <Pressable style={styles.btnAdd} onPress={() => handleAddToList(setInstructions, instInput, setInstInput)}>
            <Text style={styles.btnAddText}>+</Text>
          </Pressable>
        </View>
        {instructions.map((step, idx) => (
            <View key={idx} style={styles.listItem}>
                <Text style={styles.listText}>{idx + 1}. {step}</Text>
                <Pressable onPress={() => handleRemoveFromList(setInstructions, idx)}>
                    <Text style={styles.removeText}>✕</Text>
                </Pressable>
            </View>
        ))}
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Etiquetas</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            value={tagInput} 
            onChangeText={setTagInput} 
            placeholder="vegano, sin gluten..." 
          />
          <Pressable style={styles.btnAdd} onPress={() => handleAddToList(setRestrictions, tagInput, setTagInput)}>
            <Text style={styles.btnAddText}>+</Text>
          </Pressable>
        </View>
        <View style={styles.tagsContainer}>
            {restrictions.map((t, idx) => (
                <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{t}</Text>
                    <Pressable onPress={() => handleRemoveFromList(setRestrictions, idx)}>
                        <Text style={styles.tagRemove}>✕</Text>
                    </Pressable>
                </View>
            ))}
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={handleSubmit}>
            <Text style={styles.btnText}>{initial ? "Guardar cambios" : "Crear receta"}</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnOutline]} onPress={onCancel}>
            <Text style={styles.btnOutlineText}>Cancelar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  group: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnAdd: {
    backgroundColor: COLORS.secondary,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius,
  },
  btnAddText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.paper,
    padding: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  removeText: {
    color: COLORS.danger,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  pills: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: COLORS.primary,
  },
  pillText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  tagRemove: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    marginLeft: 4,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  btn: {
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnOutlineText: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 16,
  },
});
