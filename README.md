# Super Recetario 🍳

Aplicación móvil de recetas de cocina construida con React Native y Expo. Permite a los usuarios explorar, buscar, filtrar y guardar recetas favoritas, así como interactuar mediante comentarios.

## 📱 Características Principales

- **Exploración de Recetas**: Navegación intuitiva con tarjetas visuales
- **Búsqueda Avanzada**: Busca por nombre o ingredientes
- **Filtros Múltiples**: Por categoría, dificultad y restricciones dietéticas
- **Favoritos**: Guarda tus recetas preferidas (requiere autenticación)
- **Detalles Completos**: Ingredientes, instrucciones paso a paso, y metadatos
- **Comentarios**: Sistema de comentarios por receta
- **Modo Oscuro**: Tema claro/oscuro que respeta preferencias del sistema
- **Responsive**: Optimizado para móviles y tablets
- **Panel Admin**: Gestión de recetas para usuarios administradores

## 🏗️ Estructura del Proyecto

```
App/
├── app/                          # Rutas de la aplicación (Expo Router)
│   ├── (tabs)/                   # Navegación principal por pestañas
│   │   ├── index.js             # Home - Lista de recetas
│   │   ├── favorites.js         # Favoritos del usuario
│   │   └── account.js           # Perfil y autenticación
│   ├── admin/                    # Rutas de administración
│   │   ├── index.js             # Lista de recetas (admin)
│   │   └── form.js              # Formulario crear/editar receta
│   ├── recipe/                   # Detalle de receta
│   │   └── [id].js              # Vista individual de receta
│   └── _layout.js               # Layout raíz de la app
│
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── RecipeCard.js        # Tarjeta de receta
│   │   ├── SearchBar.js         # Barra de búsqueda
│   │   ├── Filters.js           # Panel de filtros
│   │   ├── Comments.js          # Sistema de comentarios
│   │   └── AdminRecipeForm.jsx  # Formulario de recetas (admin)
│   ├── services/                # Comunicación con backend
│   │   └── api.js               # Funciones de API
│   ├── store/                   # State management
│   │   ├── authContext.js       # Contexto de autenticación
│   │   └── themeContext.js      # Contexto de tema
│   └── constants/
│       └── theme.js             # Colores y estilos globales
│
├── hooks/                        # Custom hooks
│   └── useThemeColor.js         # Hook para colores adaptativos
│
└── assets/                       # Recursos estáticos
    ├── app-icon.png
    ├── splash-screen.png
    └── ...
```

## 🔧 Tecnologías Utilizadas

- **React Native** - Framework para desarrollo móvil multiplataforma
- **Expo** (~54.0) - Herramientas y servicios para React Native
- **Expo Router** - Navegación basada en sistema de archivos
- **Expo Image** - Componente de imagen optimizado
- **AsyncStorage** - Almacenamiento local persistente
- **React Context API** - Gestión de estado global (auth y theme)
- **Ionicons** - Librería de iconos

## 🎨 Sistema de Temas

### Colores Definidos (theme.js)

La app usa dos temas: **Light** y **Dark**

**Light Mode:**

- `background`: #E8F4F8 (azul claro)
- `cardBackground`: #FFFEF9 (beige/papel)
- `text`: #2C3E50 (gris oscuro)
- `primary`: #88AB8E (verde suave)

**Dark Mode:**

- `background`: #1A1A1A (casi negro)
- `cardBackground`: #2D2D2D (gris oscuro)
- `text`: #E0E0E0 (gris claro)
- `primary`: #A8C5A0 (verde claro)

### Cómo Cambiar Colores

1. Abre `src/constants/theme.js`
2. Modifica el objeto `Colors.light` o `Colors.dark`
3. Los componentes se actualizarán automáticamente

```javascript
export const Colors = {
  light: {
    background: "#TU_COLOR",
    // ...
  },
  dark: {
    background: "#TU_COLOR",
    // ...
  },
};
```

### Usar Colores en Componentes

```javascript
import { useThemeColor } from "../../hooks/useThemeColor";

const backgroundColor = useThemeColor({}, "background");
const textColor = useThemeColor({}, "text");

<View style={{ backgroundColor }}>
  <Text style={{ color: textColor }}>Texto</Text>
</View>;
```

## 🔐 Sistema de Autenticación

El contexto `authContext.js` maneja:

- Login/Logout
- Registro de usuarios
- Estado de autenticación persistente (SecureStore)
- Roles de usuario (admin/user)

### Verificar si el usuario está autenticado:

```javascript
import { useAuth } from "../src/store/authContext";

const { user, isAdmin } = useAuth();

if (user) {
  // Usuario logueado
}

if (isAdmin) {
  // Usuario es administrador
}
```

## 📡 Conexión con Backend

Todas las llamadas API están en `src/services/api.js`

### Configurar URL del Backend:

```javascript
// api.js
const BASE_URL = "http://TU_IP:3000/api";
```

### Funciones Disponibles:

- `getRecipes()` - Obtener todas las recetas
- `getRecipeById(id)` - Obtener receta específica
- `getUserFavorites(token)` - Favoritos del usuario
- `addFavorite(recipeId, token)` - Agregar a favoritos
- `removeFavorite(recipeId, token)` - Quitar de favoritos
- `getComments(recipeId)` - Comentarios de receta
- `addComment(recipeId, text, token)` - Agregar comentario
- `loginUser(credentials)` - Iniciar sesión
- `registerUser(data)` - Registrar usuario

## 🔄 Navegación (Expo Router)

La estructura de carpetas en `app/` define las rutas automáticamente:

- `/` → `app/(tabs)/index.js` (Home)
- `/favorites` → `app/(tabs)/favorites.js`
- `/account` → `app/(tabs)/account.js`
- `/recipe/123` → `app/recipe/[id].js`
- `/admin` → `app/admin/index.js`
- `/admin/form` → `app/admin/form.js`

### Navegar Programáticamente:

```javascript
import { useRouter } from "expo-router";

const router = useRouter();

router.push("/recipe/123"); // Ir a detalle de receta
router.back(); // Volver atrás
```

## 📝 Modificar Funcionalidades

### Agregar un Nuevo Filtro

1. Abre `src/components/Filters.js`
2. Agrega el nuevo filtro al estado local
3. Emite el cambio mediante `onFiltersChange`
4. En `app/(tabs)/index.js`, aplica el filtro en la función `filtered`

### Cambiar Layout de Tarjetas

Las tarjetas usan un layout de **1 columna** en móvil y **3 columnas** en tablet.

Para cambiar el breakpoint:

```javascript
// index.js o favorites.js
const numColumns = width > 600 ? 3 : 1; // Cambia 600 al ancho deseado
```

### Modificar Campos del Formulario de Recetas

1. Abre `src/components/AdminRecipeForm.jsx`
2. Agrega los campos al estado inicial
3. Crea inputs correspondientes en el JSX
4. Asegúrate de incluir el campo en `buildFormData()`

### Personalizar Header

Todos los headers usan el mismo estilo definido en cada archivo de ruta.

Para cambiar el diseño:

```javascript
// Busca "headerContainer" y "headerRow" en los archivos
headerRow: {
  paddingVertical: 12,      // Cambia padding
  paddingHorizontal: 20,
  borderRadius: 26,         // Cambia redondez
  // ...
}
```

## 🎯 Responsive Design

### Detección de Tablet:

```javascript
import { useWindowDimensions } from "react-native";

const { width } = useWindowDimensions();
const isTablet = width > 600;
```

### Grid Responsive:

```javascript
<FlatList
  numColumns={numColumns}
  key={numColumns} // Importante para re-render
  columnWrapperStyle={
    numColumns > 1 ? { justifyContent: "flex-start" } : undefined
  }
  renderItem={({ item }) => (
    <View
      style={{
        flex: 1,
        maxWidth: `${100 / numColumns}%`,
        padding: 8,
      }}
    >
      <RecipeCard receta={item} />
    </View>
  )}
/>
```

## 🧪 Desarrollo

### Iniciar la Aplicación:

```bash
npm start
# o
npx expo start
```

### Ejecutar en Dispositivo:

- **Android**: Presiona `a` en la terminal o escanea QR con Expo Go
- **iOS**: Presiona `i` o escanea QR con Expo Go

### Variables de Entorno:

Configura la IP del backend en `src/services/api.js`:

```javascript
const BASE_URL = "http://192.168.1.X:3000/api";
```

### Compilar para Producción:

```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## 📂 Archivos Importantes

| Archivo                  | Propósito                                            |
| ------------------------ | ---------------------------------------------------- |
| `app.json`               | Configuración de Expo (nombre, versión, icono, etc.) |
| `package.json`           | Dependencias del proyecto                            |
| `src/constants/theme.js` | Colores y estilos globales                           |
| `src/services/api.js`    | Comunicación con backend                             |
| `hooks/useThemeColor.js` | Hook para colores adaptativos                        |

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"

- Verifica que el backend esté corriendo
- Asegúrate de usar la IP correcta en `api.js`
- En Android, usa `http://10.0.2.2:3000` si usas emulador

### Tema no cambia:

- Verifica que uses `useThemeColor` para colores dinámicos
- No uses colores hardcodeados de COLORS directamente en estilos

### Las imágenes no cargan:

- Verifica que la URL del backend sea accesible
- Usa `expo-image` en lugar de `react-native` Image
---

**Desarrollado con ❤️ usando Expo y React Native**
