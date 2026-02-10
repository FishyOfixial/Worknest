import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

function ProjectsPage() {
  const { workspaceId } = useParams();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`workspaces/${workspaceId}/projects/`);
        setProjects(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, [workspaceId]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Proyectos</h2>

      {projects.length === 0 && <p>No hay proyectos aún</p>}

      {projects.map(p => (
        <Link
            key={p.id}
            to={`/projects/${p.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <div style={{
            border: "1px solid gray",
            padding: 15,
            marginTop: 10,
            cursor: "pointer"
            }}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            </div>
        </Link>
      ))}
    </div>
  );
}

export default ProjectsPage;
