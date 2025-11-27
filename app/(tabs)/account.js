import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert, 
  ActivityIndicator,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../src/store/authContext";
import { useTheme } from "../../src/store/themeContext";
import { useThemeColor } from "../../hooks/useThemeColor";
import { COLORS, SIZES, SHADOWS } from "../../src/constants/theme";

export default function Account() {
  const router = useRouter();
  const { user, login, register, logout, isLoading } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState("login");

  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const textLightColor = useThemeColor({}, "textLight");
  const headerBg = useThemeColor({}, "headerBackground");
  const headerText = useThemeColor({}, "headerText");
  const inputBg = useThemeColor({}, "inputBackground");
  const placeholderColor = useThemeColor({}, "placeholderText");
  const borderColor = useThemeColor({}, "borderColor");
  const btnPrimary = useThemeColor({}, "buttonPrimary");
  const btnText = useThemeColor({}, "buttonText");
  const dangerColor = useThemeColor({}, "danger");

  const [lEmail, setLEmail] = useState("");
  const [lPassword, setLPassword] = useState("");
  const [lShowPass, setLShowPass] = useState(false);
  const [lLoading, setLLoading] = useState(false);

  const [rEmail, setREmail] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rShowPass, setRShowPass] = useState(false);
  const [rUsername, setRUsername] = useState("");
  const [rLoading, setRLoading] = useState(false);

  const handleLogin = async () => {
    if (!lEmail || !lPassword)
      return Alert.alert("Error", "Completa todos los campos");
    setLLoading(true);
    try {
      await login({ email: lEmail, password: lPassword });
    } catch (e) {} 
    finally {
      setLLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!rEmail || !rPassword || !rUsername)
      return Alert.alert("Error", "Completa todos los campos");
    setRLoading(true);
    try {
      await register({ email: rEmail, password: rPassword, username: rUsername });
    } catch (e) {} 
    finally {
      setRLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={btnPrimary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.headerContainer}>
        <View style={[styles.headerRow, { backgroundColor: headerBg }]}>
          <Text style={[styles.appTitle, { color: headerText }]}>SUPER RECETARIO</Text>
        </View>
      </View>

      <View style={[styles.screen, { backgroundColor }]}>
        <ScrollView
          style={[styles.scroll, { backgroundColor }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >

          {/* ---------- MODO LOGUEADO ---------- */}
          {user ? (
            <View style={[styles.panel, { backgroundColor: cardBg }]}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: btnPrimary }]}>
                  <Text style={[styles.avatarText, { color: btnText }]}>
                    {user.username?.[0]?.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.username, { color: textColor }]}>{user.username}</Text>
                <Text style={[styles.role, { color: textLightColor }]}>{user.role}</Text>
              </View>

              <View style={[styles.infoSection, { borderColor }]}>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: textLightColor }]}>Email</Text>
                  <Text style={[styles.value, { color: textColor }]}>{user.email}</Text>
                </View>
                
                {/* Theme Toggle */}
                <View style={styles.row}>
                  <Text style={[styles.label, { color: textLightColor }]}>Modo Oscuro</Text>
                  <Switch 
                    value={theme === 'dark'} 
                    onValueChange={toggleTheme}
                    trackColor={{ false: "#767577", true: btnPrimary }}
                    thumbColor={theme === 'dark' ? "#f4f3f4" : "#f4f3f4"}
                  />
                </View>
              </View>

              {user.role === "admin" && (
                <Pressable
                  style={[styles.btn, styles.btnAdmin, { borderColor: btnPrimary, backgroundColor: 'transparent' }]}
                  onPress={() => router.push("/admin")}
                >
                  <Ionicons name="settings-outline" size={20} color={btnPrimary} />
                  <Text style={[styles.btnText, { color: btnPrimary }]}>
                    Administrar Recetas
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={[styles.btn, styles.btnLogout, { backgroundColor: COLORS.danger }]}
                onPress={logout}
              >
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={[styles.btnText, { color: "#fff" }]}>Cerrar sesión</Text>
              </Pressable>
            </View>
          ) : (
            /* ---------- MODO LOGIN / REGISTRO ---------- */
            <>

              <View style={styles.illustrationWrapper}>
                <View style={[styles.illustrationCircle, { backgroundColor: cardBg }]}>
                  <Ionicons name="image-outline" size={46} color={btnPrimary} />
                </View>
              </View>

              <View style={[styles.authPanel, { backgroundColor: cardBg }]}>
                {mode === "login" ? (
                  <View style={styles.form}>
                    <Text style={[styles.formTitle, { color: textColor }]}>Iniciar Sesión</Text>

                    <View style={styles.inputGroup}>
                      <Text style={[styles.fieldLabel, { color: textColor }]}>Username</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                        placeholder="Ingresa tu usuario..."
                        placeholderTextColor={placeholderColor}
                        value={lEmail}
                        onChangeText={setLEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={[styles.fieldLabel, { color: textColor }]}>Contraseña</Text>
                      <View style={[styles.passwordContainer, { backgroundColor: inputBg, borderColor }]}>
                        <TextInput
                          style={[styles.passwordInput, { color: textColor }]}
                          placeholder="********"
                          placeholderTextColor={placeholderColor}
                          secureTextEntry={!lShowPass}
                          value={lPassword}
                          onChangeText={setLPassword}
                        />
                        <Pressable onPress={() => setLShowPass(!lShowPass)}>
                          <Ionicons
                            name={lShowPass ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={placeholderColor}
                          />
                        </Pressable>
                      </View>
                    </View>

                    <Pressable
                      style={[styles.btn, styles.btnPrimary, { backgroundColor: btnPrimary }]}
                      onPress={handleLogin}
                    >
                      {lLoading ? (
                        <ActivityIndicator color={btnText} />
                      ) : (
                        <Text style={[styles.btnText, { color: btnText }]}>Iniciar Sesión</Text>
                      )}
                    </Pressable>

                    <Text style={[styles.helperText, { color: textColor }]}>
                      Si no tienes una cuenta{" "}
                      <Text style={[styles.helperLink, { color: textColor }]} onPress={() => setMode("register")}>
                        regístrate aquí
                      </Text>
                    </Text>
                  </View>
                ) : (
                  /* Registro */
                  <View style={styles.form}>
                    <Text style={[styles.formTitle, { color: textColor }]}>Crear cuenta nueva</Text>

                    <View style={styles.inputGroup}>
                      <Text style={[styles.fieldLabel, { color: textColor }]}>Nombre de usuario</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                        placeholder="Usuario"
                        placeholderTextColor={placeholderColor}
                        value={rUsername}
                        onChangeText={setRUsername}
                        autoCapitalize="none"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={[styles.fieldLabel, { color: textColor }]}>Correo electrónico</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                        placeholder="ejemplo@correo.com"
                        placeholderTextColor={placeholderColor}
                        keyboardType="email-address"
                        value={rEmail}
                        onChangeText={setREmail}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={[styles.fieldLabel, { color: textColor }]}>Contraseña</Text>
                      <View style={[styles.passwordContainer, { backgroundColor: inputBg, borderColor }]}>
                        <TextInput
                          style={[styles.passwordInput, { color: textColor }]}
                          placeholder="********"
                          placeholderTextColor={placeholderColor}
                          secureTextEntry={!rShowPass}
                          value={rPassword}
                          onChangeText={setRPassword}
                        />
                        <Pressable onPress={() => setRShowPass(!rShowPass)}>
                          <Ionicons
                            name={rShowPass ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={placeholderColor}
                          />
                        </Pressable>
                      </View>
                    </View>

                    <Pressable
                      style={[styles.btn, styles.btnPrimary, { backgroundColor: btnPrimary }]}
                      onPress={handleRegister}
                    >
                      {rLoading ? (
                        <ActivityIndicator color={btnText} />
                      ) : (
                        <Text style={[styles.btnText, { color: btnText }]}>Crear cuenta</Text>
                      )}
                    </Pressable>

                    <Text style={[styles.helperText, { color: textColor }]}>
                      ¿Ya tienes una cuenta?{" "}
                      <Text style={[styles.helperLink, { color: textColor }]} onPress={() => setMode("login")}>
                        Inicia sesión
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 26,
    marginBottom: 14,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 0,
  },
  illustrationWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  illustrationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  authPanel: {
    width: "100%",
    padding: 24,
    borderRadius: 40,
    ...SHADOWS.default,
  },
  form: {
    gap: 16,
  },
  formTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  inputGroup: {
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    fontSize: 16,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnPrimary: {
    marginTop: 12,
  },
  btnLogout: {
    marginTop: 12,
  },
  btnAdmin: {
    borderWidth: 1,
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  helperText: {
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  helperLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  panel: {
    padding: 24,
    borderRadius: 40,
    ...SHADOWS.default,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 6,
  },
  role: {
    textAlign: "center",
    marginTop: 2,
    marginBottom: 12,
  },
  infoSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontWeight: "600",
  },
  value: {
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
