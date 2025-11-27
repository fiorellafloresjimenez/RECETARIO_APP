import { useEffect, useMemo, useState, useContext } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import { AuthContext } from "../store/authContext";
import { getRecipes } from "../services/api";
import { useThemeColor } from "../../hooks/useThemeColor";

const DIFFICULTIES = ["Fácil", "Intermedio", "Difícil"];

export default function AdminRecipeForm({ initial = null, onSubmit, onCancel }) {
  const { token } = useContext(AuthContext);
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

  const [existingCategories, setExistingCategories] = useState([]);

  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground"); // Using cardBg for inputs to distinguish from main bg
  const textColor = useThemeColor({}, "text");
  const textLightColor = useThemeColor({}, "textLight");
  const borderColor = useThemeColor({}, "borderColor");
  const inputBg = useThemeColor({}, "inputBackground");
  const placeholderColor = useThemeColor({}, "placeholderText");
  const btnPrimary = useThemeColor({}, "buttonPrimary");
  const btnText = useThemeColor({}, "buttonText");
  const dangerColor = useThemeColor({}, "danger");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const recipes = await getRecipes(token);
        const cats = new Set();
        recipes.forEach(r => {
          if (r.category) cats.add(r.category);
        });
        setExistingCategories(Array.from(cats).sort());
      } catch (e) {
        console.log("Error fetching categories", e);
      }
    };
    fetchCategories();
  }, [token]);

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

  const inputStyle = [styles.input, { backgroundColor: inputBg, borderColor, color: textColor }];
  const labelStyle = [styles.label, { color: textColor }];

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={styles.content}>
      <View style={styles.group}>
        <Text style={labelStyle}>Nombre</Text>
        <TextInput 
            style={inputStyle} 
            value={name} 
            onChangeText={setName} 
            placeholder="Nombre de la receta" 
            placeholderTextColor={placeholderColor}
        />
      </View>

      <View style={styles.group}>
        <Text style={labelStyle}>Descripción</Text>
        <TextInput 
            style={[inputStyle, styles.textArea]} 
            value={description} 
            onChangeText={setDescription} 
            placeholder="Describe la receta" 
            placeholderTextColor={placeholderColor}
            multiline 
            numberOfLines={3}
        />
      </View>

      <View style={styles.group}>
        <Text style={labelStyle}>Imagen (URL)</Text>
        <TextInput 
            style={inputStyle} 
            value={image} 
            onChangeText={setImage} 
            onBlur={handleImageBlur}
            placeholder="https://... o nombre.jpg" 
            placeholderTextColor={placeholderColor}
        />
        <Text style={[styles.helperText, { color: textLightColor }]}>Dejar vacío para usar la imagen por defecto basada en el ID.</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.group, { flex: 1 }]}>
            <Text style={labelStyle}>Tiempo (min)</Text>
            <TextInput 
                style={inputStyle} 
                value={cookTime} 
                onChangeText={setCookTime} 
                keyboardType="numeric"
                placeholderTextColor={placeholderColor}
            />
        </View>
        <View style={[styles.group, { flex: 1 }]}>
            <Text style={labelStyle}>Porciones</Text>
            <TextInput 
                style={inputStyle} 
                value={servings} 
                onChangeText={setServings} 
                keyboardType="numeric"
                placeholderTextColor={placeholderColor}
            />
        </View>
      </View>

      <View style={styles.group}>
        <Text style={labelStyle}>Dificultad</Text>
        <View style={styles.pills}>
            {DIFFICULTIES.map((d) => (
                <Pressable 
                    key={d} 
                    style={[styles.pill, { borderColor: btnPrimary }, difficulty === d && { backgroundColor: btnPrimary }]}
                    onPress={() => setDifficulty(d)}
                >
                    <Text style={[styles.pillText, { color: btnPrimary }, difficulty === d && { color: btnText }]}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                    </Text>
                </Pressable>
            ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={labelStyle}>Categoría</Text>
        <TextInput 
            style={inputStyle} 
            value={category} 
            onChangeText={setCategory} 
            placeholder="Postre, Plato principal..." 
            placeholderTextColor={placeholderColor}
        />
        {existingCategories.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {existingCategories.map((cat, idx) => (
              <Pressable 
                key={idx} 
                style={[styles.pill, { borderColor: btnPrimary }, category === cat && { backgroundColor: btnPrimary }]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.pillText, { color: btnPrimary }, category === cat && { color: btnText }]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.group}>
        <Text style={labelStyle}>Ingredientes</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={[inputStyle, { flex: 1 }]} 
            value={ingInput} 
            onChangeText={setIngInput} 
            placeholder="Agregar ingrediente" 
            placeholderTextColor={placeholderColor}
          />
          <Pressable style={[styles.btnAdd, { backgroundColor: COLORS.secondary }]} onPress={() => handleAddToList(setIngredients, ingInput, setIngInput)}>
            <Text style={styles.btnAddText}>+</Text>
          </Pressable>
        </View>
        {ingredients.map((ing, idx) => (
            <View key={idx} style={[styles.listItem, { backgroundColor: inputBg, borderColor }]}>
                <Text style={[styles.listText, { color: textColor }]}>{idx + 1}. {ing}</Text>
                <Pressable onPress={() => handleRemoveFromList(setIngredients, idx)}>
                    <Text style={[styles.removeText, { color: dangerColor }]}>✕</Text>
                </Pressable>
            </View>
        ))}
      </View>

      <View style={styles.group}>
        <Text style={labelStyle}>Pasos</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={[inputStyle, { flex: 1 }]} 
            value={instInput} 
            onChangeText={setInstInput} 
            placeholder="Agregar paso" 
            placeholderTextColor={placeholderColor}
          />
          <Pressable style={[styles.btnAdd, { backgroundColor: COLORS.secondary }]} onPress={() => handleAddToList(setInstructions, instInput, setInstInput)}>
            <Text style={styles.btnAddText}>+</Text>
          </Pressable>
        </View>
        {instructions.map((step, idx) => (
            <View key={idx} style={[styles.listItem, { backgroundColor: inputBg, borderColor }]}>
                <Text style={[styles.listText, { color: textColor }]}>{idx + 1}. {step}</Text>
                <Pressable onPress={() => handleRemoveFromList(setInstructions, idx)}>
                    <Text style={[styles.removeText, { color: dangerColor }]}>✕</Text>
                </Pressable>
            </View>
        ))}
      </View>

      <View style={styles.group}>
        <Text style={labelStyle}>Etiquetas</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={[inputStyle, { flex: 1 }]} 
            value={tagInput} 
            onChangeText={setTagInput} 
            placeholder="vegano, sin gluten..." 
            placeholderTextColor={placeholderColor}
          />
          <Pressable style={[styles.btnAdd, { backgroundColor: COLORS.secondary }]} onPress={() => handleAddToList(setRestrictions, tagInput, setTagInput)}>
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

      {error ? <Text style={[styles.errorText, { color: dangerColor }]}>{error}</Text> : null}

      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.btnPrimary, { backgroundColor: btnPrimary }]} onPress={handleSubmit}>
            <Text style={[styles.btnText, { color: btnText }]}>{initial ? "Guardar cambios" : "Crear receta"}</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnOutline, { borderColor: textLightColor }]} onPress={onCancel}>
            <Text style={[styles.btnOutlineText, { color: textLightColor }]}>Cancelar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: 16,
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
    padding: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
  },
  listText: {
    flex: 1,
    fontSize: 14,
  },
  removeText: {
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
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  pillText: {
    fontWeight: '600',
  },
  categoryScroll: {
    marginTop: 8,
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
    textAlign: 'center',
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 12,
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
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnOutlineText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
