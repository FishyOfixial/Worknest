import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import WorkspacesPage from "./pages/WorkspacesPage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import TaskDetailsPage from "./pages/TaskDetailPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Login />} />

      {/* PRIVADO + LAYOUT */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route path="/workspaces/:workspaceId" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<TasksPage />} />
        <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
