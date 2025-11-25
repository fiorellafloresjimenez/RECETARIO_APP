import { useContext, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../src/store/authContext";
import { COLORS, SIZES } from "../../src/constants/theme";

export default function Account() {
  const router = useRouter();
  const { user, login, register, logout, isLoading } = useContext(AuthContext);
  const [mode, setMode] = useState("login"); // login | register
  
  // Login state
  const [lEmail, setLEmail] = useState("");
  const [lPassword, setLPassword] = useState("");
  const [lLoading, setLLoading] = useState(false);

  // Register state
  const [rEmail, setREmail] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rUsername, setRUsername] = useState("");
  const [rLoading, setRLoading] = useState(false);

  const handleLogin = async () => {
    if (!lEmail || !lPassword) return Alert.alert("Error", "Completa todos los campos");
    setLLoading(true);
    try {
      await login({ email: lEmail, password: lPassword });
    } catch (e) {
      // Alert handled in context
    } finally {
      setLLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!rEmail || !rPassword || !rUsername) return Alert.alert("Error", "Completa todos los campos");
    setRLoading(true);
    try {
      await register({ email: rEmail, password: rPassword, username: rUsername });
    } catch (e) {
      // Alert handled in context
    } finally {
      setRLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mi Cuenta</Text>
        <View style={styles.panel}>
          <View style={styles.row}>
            <Text style={styles.label}>Usuario:</Text>
            <Text style={styles.value}>{user.username}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rol:</Text>
            <Text style={styles.value}>{user.role}</Text>
          </View>
          
          {user.role === "admin" && (
            <Pressable 
              style={[styles.btn, { backgroundColor: COLORS.honey, marginBottom: 12 }]} 
              onPress={() => router.push("/admin")}
            >
              <Text style={[styles.btnText, { color: COLORS.coffee }]}>Administrar Recetas</Text>
            </Pressable>
          )}

          <Pressable style={[styles.btn, styles.btnLogout]} onPress={logout}>
            <Text style={styles.btnText}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Bienvenido</Text>
      
      <View style={styles.tabs}>
        <Pressable 
          style={[styles.tab, mode === "login" && styles.tabActive]} 
          onPress={() => setMode("login")}
        >
          <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>Iniciar Sesión</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, mode === "register" && styles.tabActive]} 
          onPress={() => setMode("register")}
        >
          <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>Registrarse</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        {mode === "login" ? (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Ingresa a tu cuenta</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={lEmail}
              onChangeText={setLEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={lPassword}
              onChangeText={setLPassword}
              secureTextEntry
            />
            <Pressable 
              style={[styles.btn, lLoading && styles.btnDisabled]} 
              onPress={handleLogin}
              disabled={lLoading}
            >
              <Text style={styles.btnText}>{lLoading ? "Cargando..." : "Entrar"}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Crea una cuenta nueva</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              value={rUsername}
              onChangeText={setRUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={rEmail}
              onChangeText={setREmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={rPassword}
              onChangeText={setRPassword}
              secureTextEntry
            />
            <Pressable 
              style={[styles.btn, rLoading && styles.btnDisabled]} 
              onPress={handleRegister}
              disabled={rLoading}
            >
              <Text style={styles.btnText}>{rLoading ? "Cargando..." : "Crear cuenta"}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 16,
  },
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginBottom: 24,
    textAlign: 'center',
  },
  panel: {
    backgroundColor: COLORS.paper,
    borderRadius: SIZES.radius,
    padding: 20,
    ...SIZES.shadow,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  label: {
    fontWeight: 'bold',
    color: COLORS.coffee,
  },
  value: {
    color: COLORS.ink,
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 20,
  },
  btnLogout: {
    backgroundColor: COLORS.danger,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: COLORS.paper,
    borderRadius: SIZES.radius,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: SIZES.radius - 4,
  },
  tabActive: {
    backgroundColor: COLORS.bg,
  },
  tabText: {
    fontWeight: '600',
    color: COLORS.muted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  form: {
    gap: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.coffee,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.honey,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: 16,
  },
});
