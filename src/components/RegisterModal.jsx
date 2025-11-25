
import { useContext, useState } from "react";
import { AuthContext } from "../store/authContext";

export default function RegisterModal({ onClose }) {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register({
        email,
        password,
        username: username || email.split("@")[0], 
        birthday: birthday || null,
        gender: gender || null,
      });
      onClose?.();
    } catch (err) {
      if (String(err.message).includes("users_email_key")) {
        setError("Este correo ya está registrado. Intenta con otro.");
      } else {
        setError("No se pudo crear la cuenta. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="modal-backdrop" style={backdrop}>
      <div className="modal" style={modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Crear cuenta</h2>
          <button className="btn-outline" onClick={onClose}>Cerrar</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label>Correo</label>
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="usuario@example.com" />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label>Contraseña</label>
            <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label>Nombre de usuario</label>
            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="usuario1" />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label>Cumpleaños <small style={{ color: "var(--muted)" }}>(opcional)</small></label>
            <input type="date" value={birthday} onChange={(e)=>setBirthday(e.target.value)} />
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <label>Género <small style={{ color: "var(--muted)" }}>(opcional)</small></label>
            <select value={gender} onChange={(e)=>setGender(e.target.value)}>
              <option value="">Selecciona</option>
              <option value="female">Femenino</option>
              <option value="male">Masculino</option>
              <option value="other">Otro</option>
              <option value="prefer_not_to_say">Prefiero no decir</option>
            </select>
          </div>

          {error && <div style={{ color: "var(--danger)", fontSize: 14 }}>{error}</div>}

          <button className="btn" type="submit">Crear cuenta</button>
        </form>
      </div>
    </div>
  );
}

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.35)",
  display: "grid",
  placeItems: "center",
  zIndex: 1000,
};
const modal = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  borderRadius: 16,
  padding: 18,
  boxShadow: "0 12px 40px rgba(0,0,0,.2)",
};
