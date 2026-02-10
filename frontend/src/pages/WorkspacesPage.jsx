import { useEffect, useState } from "react";
import { getWorkspaces, createWorkspace, updateWorkspace } from "../api/workspaces";
import { Link } from "react-router-dom";

function WorkspacesPage() {
const [workspaces, setWorkspaces] = useState([]);

const [showModal, setShowModal] = useState(false);
const [name, setName] = useState("");

const [editingWorkspace, setEditingWorkspace] = useState(null);
const [editName, setEditName] = useState("");


useEffect(() => {
    const load = async () => {
        try {
            const data = await getWorkspaces();
            setWorkspaces(data);
        } catch (err) {
            console.log(err);
        }
    };
    load();
}, []);


const handleCreateWorkspace = async () => {
    if (!name.trim()) return;
    try {
        const newWs = await createWorkspace({
            name,
        });

        setWorkspaces((prev) => [...prev, newWs]);

        setName("");
        setShowModal(false);
    } catch (err) {
        console.log(err.response?.data || err);
        alert("No se pudo crear el workspace");
    }
};


const handleUpdateWorkspace = async () => {
    if (!editName.trim()) return;

    try {
    const updated = await updateWorkspace(editingWorkspace.id, {
        name: editName,
    });

    setWorkspaces((prev) =>
        prev.map((ws) => (ws.id === updated.id ? updated : ws))
    );

    setEditingWorkspace(null);
    setEditName("");
    } catch (err) {
    console.log(err.response?.data || err);
    }
};




return ( 
<div style={styles.container}>

    <header style={styles.header}> 
        <div> 
            <h1 style={styles.brand}>Worknest</h1> 
            <p style={styles.subtitle}>Gestiona tus proyectos y equipos</p> 
        </div>
        <button
            onClick={() => setShowModal(true)}
            style={styles.createButton}
            >
            + Nuevo Workspace 
        </button> 
    </header>


    <hr style={styles.divider} />

    <div style={styles.grid}>
        {workspaces.length === 0 ? (
            <div style={styles.emptyState}>
            <p>Aún no tienes espacios de trabajo. ¡Crea el primero!</p>
            </div>
        ) : (
            workspaces.map((ws) => (
            <Link key={ws.id} to={`/workspaces/${ws.id}`} style={styles.link}>
                <div
                    style={styles.card}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow =
                        "0 20px 40px rgba(15,23,42,0.12)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0px)";
                        e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(15,23,42,0.06), 0 2px 6px rgba(15,23,42,0.04)";
                    }}
                >
                    <div style={styles.cardTopRow}>
                        <div style={styles.cardIcon}>
                        {ws.name.charAt(0).toUpperCase()}
                        </div>

                        <button
                        onClick={(e) => {
                            e.preventDefault();
                            setEditingWorkspace(ws);
                            setEditName(ws.name);
                        }}
                        style={styles.editButton}
                        title="Editar nombre"
                        >
                        ✏️
                        </button>
                    </div>
                    <h3 style={styles.cardTitle}>{ws.name}</h3>
                    <div style={styles.cardFooter}>Ver detalles →</div>
                </div>
            </Link>
            ))
        )}
    </div>

    {showModal && (
    <div style={styles.modalOverlay}>
        <div style={styles.modal}>
        <h2 style={{ marginTop: 0 }}>Crear Workspace</h2>

        <input
            placeholder="Nombre del workspace"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
        />

        <div style={styles.modalButtons}>
            <button
            onClick={() => setShowModal(false)}
            style={styles.cancelButton}
            >
            Cancelar
            </button>

            <button
            onClick={handleCreateWorkspace}
            style={styles.confirmButton}
            >
            Crear
            </button>
        </div>
        </div>
    </div>
    )}

    {editingWorkspace && (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>
            <h2 style={{ marginTop: 0 }}>Editar Workspace</h2>

            <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={styles.input}
            />

            <div style={styles.modalButtons}>
                <button
                onClick={() => setEditingWorkspace(null)}
                style={styles.cancelButton}
                >
                Cancelar
                </button>

                <button
                onClick={handleUpdateWorkspace}
                style={styles.confirmButton}
                >
                Guardar
                </button>
            </div>
            </div>
        </div>
    )}

    </div>
);
}

const styles = {
container: {
    padding: "48px 12%",
    background: "linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)",
    minHeight: "100vh",
    fontFamily:
    "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
},

header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
},

brand: {
    color: "#020617",
    fontSize: "2.7rem",
    margin: 0,
    fontWeight: "900",
    letterSpacing: "-1px",
},

subtitle: {
    color: "#475569",
    marginTop: "6px",
    fontSize: "0.95rem",
},

createButton: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
    border: "none",
    padding: "13px 26px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
    boxShadow:
    "0 10px 25px rgba(15, 23, 42, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
    transition: "all 0.18s ease",
},

divider: {
    border: "0",
    height: "1px",
    background:
    "linear-gradient(90deg, transparent, rgba(100,116,139,0.35), transparent)",
    marginBottom: "42px",
},

grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "28px",
},

link: {
    textDecoration: "none",
    color: "inherit",
},

card: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(8px)",
    padding: "26px",
    borderRadius: "20px",
    border: "1px solid rgba(226,232,240,0.7)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition: "all 0.22s cubic-bezier(.4,.2,.2,1)",
    boxShadow:
    "0 8px 20px rgba(15,23,42,0.06), 0 2px 6px rgba(15,23,42,0.04)",
},

cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
},

cardIcon: {
    width: "46px",
    height: "46px",
    background:
    "linear-gradient(135deg, #e2e8f0, #cbd5f5)",
    color: "#0f172a",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "1.1rem",
    marginBottom: "18px",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
},

cardTitle: {
    margin: "0 0 8px 0",
    color: "#020617",
    fontSize: "1.3rem",
    fontWeight: "700",
    letterSpacing: "-0.2px",
},

cardFooter: {
    marginTop: "22px",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#2563eb",
    opacity: 0.9,
},

emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "70px",
    color: "#64748b",
    border: "2px dashed #cbd5e1",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.65)",
    backdropFilter: "blur(6px)",
},

modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(15, 23, 42, 0.35)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
},

modal: {
    background: "white",
    padding: "34px",
    borderRadius: "20px",
    width: "420px",
    boxShadow:
    "0 25px 60px rgba(2,6,23,0.35), 0 5px 20px rgba(2,6,23,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    animation: "fadeIn 0.15s ease",
},

input: {
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border 0.15s, box-shadow 0.15s",
},

textarea: {
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    minHeight: "90px",
    resize: "none",
    fontSize: "0.95rem",
    outline: "none",
},

modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px",
},

cancelButton: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
    fontWeight: "500",
},

confirmButton: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(37,99,235,0.35)",
},

editButton: {
    border: "none",
    background: "transparent",
    fontSize: "1.1rem",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "8px",
    transition: "all 0.15s ease",
    opacity: 0.55,
},

};


export default WorkspacesPage;
