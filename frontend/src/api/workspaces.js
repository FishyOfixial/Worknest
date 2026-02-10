import api from "./client";

export const getWorkspaces = async () => {
  const response = await api.get("workspaces/");
  return response.data;
};

export const createWorkspace = async (workspace) => {
  const res = await api.post("workspaces/", workspace);
  return res.data;
};

export const updateWorkspace = async (id, data) => {
  const res = await api.patch(`workspaces/${id}/`, data);
  return res.data;
};
