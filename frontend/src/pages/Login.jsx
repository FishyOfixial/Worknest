import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(email, password);
      loginUser(res);
      navigate("/workspaces");
    } catch (err) {
      setError("Credenciales inválidas. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {/* Logo y Encabezado */}
        <div style={styles.header}>
          <div style={styles.logoIcon}>W</div>
          <h1 style={styles.brand}>Worknest</h1>
          <p style={styles.subtitle}>Bienvenido de nuevo, inicia sesión.</p>
        </div>

        {/* Formulario */}
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              placeholder="nombre@empresa.com"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={styles.errorBanner}>{error}</div>}

          <button 
            type="submit" 
            style={loading ? {...styles.button, opacity: 0.7} : styles.button}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Entrar a mi cuenta"}
          </button>
        </form>

        <footer style={styles.footer}>
          <p>¿No tienes cuenta? <span style={styles.link}>Contacta a tu administrador</span></p>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // Degradado azul oscuro
    fontFamily: "'Inter', sans-serif",
  },
  loginCard: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: "420px",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  header: {
    marginBottom: "32px",
  },
  logoIcon: {
    width: "48px",
    height: "48px",
    background: "#3b82f6",
    color: "white",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.5rem",
    margin: "0 auto 16px auto",
  },
  brand: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 8px 0",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "0.95rem",
    margin: 0,
  },
  form: {
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    color: "#1e293b",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.2s",
  },
  errorBanner: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    marginBottom: "15px",
    border: "1px solid #fee2e2",
    textAlign: "center",
  },
  footer: {
    marginTop: "32px",
    fontSize: "0.85rem",
    color: "#64748b",
  },
  link: {
    color: "#3b82f6",
    fontWeight: "600",
    cursor: "pointer",
  }
};