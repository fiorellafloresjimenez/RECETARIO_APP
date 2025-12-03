# 🍳 Super Recetario

<div align="center">

![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Architecture](https://img.shields.io/badge/Architecture-Expo_Router-4630EB?style=for-the-badge&logo=expo&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 💡 Resumen del Proyecto

**Super Recetario** es la herramienta definitiva para la cocina moderna. Desarrollada con la potencia de **React Native** y **Expo**, esta aplicación combina un diseño elegante con un rendimiento excepcional. Descubre nuevas ideas, organiza tus platos favoritos y cocina paso a paso con una interfaz fluida e intuitiva. Pensada para quienes buscan rapidez y estilo, Super Recetario convierte tu dispositivo en el mejor asistente de cocina.

---

## 📑 Índice

- [Arquitectura Técnica](#-arquitectura-técnica)
- [Funcionalidades Detalladas](#-funcionalidades-detalladas)
- [Sistema de Diseño](#-sistema-de-diseño)
- [Guía de Instalación](#-guía-de-instalación)
- [Estructura del Código](#-estructura-del-código)

---

## 🏗️ Arquitectura Técnica

El proyecto sigue una arquitectura modular y escalable, diseñada para facilitar el mantenimiento y la expansión futura.

### Stack (Core Stack)

- **Runtime**: [React Native](https://reactnative.dev/) (0.81) - Para una experiencia nativa real a 60fps.
- **Framework**: [Expo](https://expo.dev/) (SDK 54) - Facilita el acceso a APIs nativas y el despliegue.
- **Enrutamiento**: [Expo Router v3](https://docs.expo.dev/router/introduction/) - Implementa una navegación basada en el sistema de archivos (File-based routing), similar a Next.js, permitiendo deep linking automático y una estructura de navegación intuitiva.

### Gestión de Estado (State Management)

Utilizamos **React Context API** para un manejo de estado global ligero y eficiente, evitando la sobreingeniería de librerías externas para este caso de uso:

- **`AuthContext`**: Gestiona el ciclo de vida de la sesión del usuario, persistencia de tokens (vía `SecureStore`) y control de acceso basado en roles (RBAC).
- **`ThemeContext`**: Controla el sistema de temas dinámico, persistiendo las preferencias del usuario.

### Capa de Servicios (Service Layer)

La comunicación con el backend está desacoplada de la UI a través de una capa de servicios en `src/services/api.js`. Esto permite:

- **Abstracción**: Los componentes no conocen los detalles de la implementación HTTP.
- **Reusabilidad**: Los métodos de la API pueden ser reutilizados en diferentes partes de la app.
- **Manejo de Errores Centralizado**: Intercepción y transformación de errores de red.

---

## 🚀 Funcionalidades Detalladas

### 1. Exploración y Descubrimiento

El _Home Feed_ utiliza un algoritmo de renderizado condicional para adaptar el layout:

- **Grid Dinámico**: Detecta el ancho del dispositivo (`useWindowDimensions`) para alternar entre una vista de lista (móvil) y un grid de 3 columnas (tablet/desktop).
- **Lazy Loading**: Las imágenes se cargan de manera diferida y optimizada usando `expo-image` para reducir el consumo de ancho de banda y memoria.

### 2. Motor de Búsqueda y Filtrado

Implementamos un sistema de filtrado en cliente de alto rendimiento:

- **Búsqueda en Tiempo Real**: Filtrado instantáneo por nombre e ingredientes.
- **Filtros Compuestos**: Permite la intersección de múltiples criterios (Categoría + Dificultad + Restricciones + Tiempo) simultáneamente.

### 3. Sistema de Recetas (Core)

- **Visualización Rica**: Renderizado de listas de ingredientes y pasos con estilos tipográficos jerárquicos.
- **Interoperabilidad RDF**: Capacidad única de exportar recetas en formato **RDF (Resource Description Framework)**, facilitando la integración con la web semántica y otros sistemas de datos estructurados.

### 4. Seguridad y Usuarios

- **Autenticación Robusta**: Flujos de Login y Registro validados.
- **Persistencia Segura**: Los tokens de sesión se almacenan en el **SecureStore** del dispositivo (Keychain en iOS, Keystore en Android), garantizando que los datos sensibles estén protegidos.

### 5. Panel de Administración

Un módulo exclusivo para usuarios con rol `admin`:

- **CRUD Completo**: Creación, lectura, actualización y eliminación de recetas.
- **Gestión de Listas Dinámicas**: Interfaz optimizada para añadir/eliminar ingredientes y pasos dinámicamente.

---

## 🎨 Sistema de Diseño

La interfaz de usuario se adhiere a principios de diseño moderno, implementados a través de un sistema de temas personalizado (`src/constants/theme.js`).

- **Tipografía**: Escala tipográfica consistente para asegurar legibilidad.
- **Paleta de Colores Semántica**:
  - Colores definidos por función (ej. `background`, `cardBackground`, `text`, `primary`) en lugar de valores absolutos.
  - **Modo Oscuro Nativo**: Todos los componentes reaccionan automáticamente al cambio de tema del sistema o a la preferencia manual del usuario.
- **Feedback Visual**: Uso de `Pressable` con estados de opacidad y micro-interacciones para confirmar acciones del usuario.

---

## 💻 Guía de Instalación

### Prerrequisitos

- Node.js (LTS)
- Gestor de paquetes (npm o yarn)
- Dispositivo móvil con **Expo Go** o Emulador (Android Studio / Xcode)

### Pasos

1.  **Clonar el Repositorio**

    ```bash
    git clone https://github.com/AlejandroAdriel/RECETARIO_APP
    cd RECETARIO_APP
    ```

2.  **Instalar Dependencias**

    ```bash
    npm install
    ```

3.  **Configuración de Entorno**

    - Verifica `src/services/api.js` para apuntar a tu servidor backend local o de producción.

4.  **Ejecución**
    ```bash
    npx expo start
    ```
    - Presiona `a` para Android.
    - Presiona `i` para iOS.
    - Presiona `w` para Web.

---

## 📂 Estructura del Código

Una estructura de carpetas semántica que separa responsabilidades claramente:

```text
App/
├── app/                    # (Presentation Layer) Rutas y Pantallas
│   ├── (tabs)/             # Navegación principal (Tabs)
│   ├── admin/              # Módulo de administración
│   ├── recipe/             # Módulo de recetas
│   └── _layout.js          # Configuración de navegación global
│
├── src/                    # (Logic & UI Layer)
│   ├── components/         # Componentes UI puros y reutilizables
│   ├── constants/          # Tokens de diseño y configuración
│   ├── hooks/              # Lógica de negocio encapsulada (Custom Hooks)
│   ├── services/           # Comunicación externa (API)
│   └── store/              # Estado global (Contexts)
│
└── assets/                 # Recursos estáticos
```

---
