const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE ||
  "https://recetario-app-backend.onrender.com";

async function http(path, { method = "GET", headers, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
    mode: "cors",
    credentials: "omit",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

function absolutizeImage(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return `${BASE_URL}${image}`;
  return image;
}

function mapRecipe(r = {}) {
  return {
    id: String(r._id ?? r.id),
    name: r.name,
    description: r.description,
    image: absolutizeImage(r.image),
    cookTime: Number(r.cookTime ?? 0),
    servings: Number(r.servings ?? 0),
    difficulty: String(r.difficulty || "").toLowerCase(),
    category: r.category || "",
    restrictions: Array.isArray(r.restrictions)
      ? r.restrictions.map((x) => String(x || "").toLowerCase())
      : [],
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    instructions: Array.isArray(r.instructions) ? r.instructions : [],
  };
}

const mapList = (arr) => (Array.isArray(arr) ? arr.map(mapRecipe) : []);

// === Recetas ===
export async function getRecipes(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const data = await http("/api/recipes", { headers });
  return mapList(data);
}

export async function getRecipeById(id, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const data = await http(`/api/recipes/${id}`, { headers });
  return mapRecipe(data);
}

export async function createRecipe(payload, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const data = await http(`/api/recipes`, {
    method: "POST",
    body: payload,
    headers,
  });
  return mapRecipe(data);
}

export async function updateRecipe(id, payload, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const data = await http(`/api/recipes/${id}`, {
    method: "PUT",
    body: payload,
    headers,
  });
  return mapRecipe(data);
}

export async function deleteRecipe(id, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return await http(`/api/recipes/${id}`, { method: "DELETE", headers });
}

// === Autenticación ===
export async function loginUser({ email, password }) {
  return await http("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function registerUser({
  email,
  password,
  username,
  birthday,
  gender,
}) {
  const body = {
    email,
    password,
    username,
    birthday: birthday || null,
    gender: gender || null,
  };
  return await http("/api/auth/register", { method: "POST", body });
}

// === Favoritos ===
export async function getUserFavorites(userId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const favoritesData = await http(`/api/auth/favorites/${userId}`, {
    headers,
  });

  if (Array.isArray(favoritesData)) {
    const promises = favoritesData.map((item) =>
      getRecipeById(item.recipe_id, token)
    );
    const recipes = await Promise.all(promises);
    return recipes.filter((r) => r && r.id);
  }
  return [];
}

export async function addFavorite(userId, recipeId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return await http(`/api/auth/favorites/${userId}`, {
    method: "PUT",
    body: { recipeId },
    headers,
  });
}

export async function removeFavorite(userId, recipeId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return await http(`/api/auth/favorites/${userId}`, {
    method: "DELETE",
    body: { recipeId },
    headers,
  });
}

// === Comentarios ===
export async function getComments(recipeId) {
  return http(`/api/comments/${recipeId}`, { method: "GET" });
}

export async function addComment(recipeId, { content, userId }) {
  return http(`/api/comments/${recipeId}`, {
    method: "POST",
    body: { content, userId },
  });
}

export async function deleteComment(commentId, userId) {
  return http(`/api/comments/${commentId}`, {
    method: "DELETE",
    body: { userId },
  });
}
