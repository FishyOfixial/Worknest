import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

function TasksPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`projects/${projectId}/tasks/`);
        setTasks(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, [projectId]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Tareas del Proyecto</h2>

      {tasks.length === 0 && <p>No hay tareas aún</p>}

      {tasks.map(task => (
        <Link 
            key={task.id} 
            to={`/tasks/${task.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <div style={{
                    border: "1px solid gray",
                    padding: 15,
                    marginTop: 10,
                    cursor: "pointer"
            }}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <strong>Estado: {task.status}</strong>
            </div>
        </Link>
      ))}
    </div>
  );
}

export default TasksPage;
