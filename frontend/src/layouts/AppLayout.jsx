import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

function AppLayout() {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    logoutUser();
    navigate("/");
  };

  const isActive = (path) => location.pathname.includes(path);
  const isRootWorkspaces = location.pathname === "/workspaces";

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>W</div>
          <h2 style={styles.logoText}>Worknest</h2>
        </div>

        <nav style={styles.navGroup}>
          <button
            style={{
              ...styles.navButton,
              ...(isActive("/workspaces") ? styles.navActive : {}),
            }}
            onClick={() => navigate("/workspaces")}
          >
            <span style={styles.icon}>🏠</span> Workspaces
          </button>

          {!isRootWorkspaces && (
            <button
              style={styles.navButton}
              onClick={() => navigate(-1)}
            >
              <span style={styles.icon}>⬅️</span> Volver
            </button>
          )}
        </nav>

        <div style={{ flex: 1 }} />

        <button style={styles.logout} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main style={styles.content}>
        <section style={styles.page}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}


const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: "260px",
    background: "#0f172a",
    color: "#f1f5f9",
    display: "flex",
    flexDirection: "column",
    padding: "30px 20px",
    boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
    zIndex: 10,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
    padding: "0 10px",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    background: "#3b82f6",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  logoText: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  navGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  navButton: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    textAlign: "left",
    padding: "12px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
  },
  navActive: {
    background: "#1e293b",
    color: "white",
  },
  icon: {
    marginRight: "12px",
    fontSize: "1.1rem",
  },
  logout: {
    background: "rgba(220, 38, 38, 0.1)",
    border: "1px solid rgba(220, 38, 38, 0.2)",
    color: "#ef4444",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  page: {
    flex: 1,
    overflowY: "auto",
    padding: "0",
  },
};

export default AppLayout;