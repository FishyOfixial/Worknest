import api from "./client";

export const login = async (email, password) => {
  const response = await api.post("auth/login/", {
    email,
    password,
  });

  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data;
};
