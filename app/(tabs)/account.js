import { useContext, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../src/store/authContext";
import { COLORS, SIZES, SHADOWS } from "../../src/constants/theme";

export default function Account() {
  const router = useRouter();
  const { user, login, register, logout, isLoading } = useContext(AuthContext);
  const [mode, setMode] = useState("login"); // login | register
  
  // Login state
  const [lEmail, setLEmail] = useState("");
  const [lPassword, setLPassword] = useState("");
  const [lShowPass, setLShowPass] = useState(false);
  const [lLoading, setLLoading] = useState(false);

  // Register state
  const [rEmail, setREmail] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rShowPass, setRShowPass] = useState(false);
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
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.username?.[0]?.toUpperCase()}</Text>
            </View>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.row}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
          </View>
          
          {user.role === "admin" && (
            <Pressable 
              style={[styles.btn, styles.btnAdmin]} 
              onPress={() => router.push("/admin")}
            >
              <Ionicons name="settings-outline" size={20} color={COLORS.primary} />
              <Text style={[styles.btnText, { color: COLORS.primary }]}>Administrar Recetas</Text>
            </Pressable>
          )}

          <Pressable style={[styles.btn, styles.btnLogout]} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
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
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={COLORS.textLight}
                value={lEmail}
                onChangeText={setLEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="********"
                  placeholderTextColor={COLORS.textLight}
                  value={lPassword}
                  onChangeText={setLPassword}
                  secureTextEntry={!lShowPass}
                />
                <Pressable onPress={() => setLShowPass(!lShowPass)} style={styles.eyeBtn}>
                  <Ionicons name={lShowPass ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textLight} />
                </Pressable>
              </View>
            </View>

            <Pressable 
              style={[styles.btn, styles.btnPrimary, lLoading && styles.btnDisabled]} 
              onPress={handleLogin}
              disabled={lLoading}
            >
              {lLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Entrar</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Crea una cuenta nueva</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre de usuario</Text>
              <TextInput
                style={styles.input}
                placeholder="Usuario"
                placeholderTextColor={COLORS.textLight}
                value={rUsername}
                onChangeText={setRUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={COLORS.textLight}
                value={rEmail}
                onChangeText={setREmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="********"
                  placeholderTextColor={COLORS.textLight}
                  value={rPassword}
                  onChangeText={setRPassword}
                  secureTextEntry={!rShowPass}
                />
                <Pressable onPress={() => setRShowPass(!rShowPass)} style={styles.eyeBtn}>
                  <Ionicons name={rShowPass ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textLight} />
                </Pressable>
              </View>
            </View>

            <Pressable 
              style={[styles.btn, styles.btnPrimary, rLoading && styles.btnDisabled]} 
              onPress={handleRegister}
              disabled={rLoading}
            >
              {rLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Crear cuenta</Text>
              )}
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
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  panel: {
    backgroundColor: COLORS.paper,
    borderRadius: SIZES.radiusLg,
    padding: 24,
    ...SHADOWS.default,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  role: {
    fontSize: 14,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  infoSection: {
    marginBottom: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontWeight: '600',
    color: COLORS.textLight,
  },
  value: {
    color: COLORS.text,
    fontWeight: '500',
  },
  btn: {
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    marginTop: 20,
    ...SHADOWS.sm,
  },
  btnAdmin: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 12,
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
    marginBottom: 24,
    backgroundColor: COLORS.paper,
    borderRadius: SIZES.radius,
    padding: 4,
    ...SHADOWS.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.radius - 4,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontWeight: '600',
    color: COLORS.textLight,
  },
  tabTextActive: {
    color: '#fff',
  },
  form: {
    gap: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeBtn: {
    padding: 14,
  },
});
