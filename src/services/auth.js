import API from "../api";

export async function login(email, password) {
  const res = await API.post("/login", { email, password });
  return res.data; // contiene { token, user }
}

export async function signup(userData) {
  const res = await API.post("/signup", userData);
  return res.data;
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
