import api from "./api";
import type { User, LoginResponse } from "@/models/types";

export type Role = "admin" | "manager" | "user";

export async function login(email: string, password: string, role: Role) {
  const res = await api.post("/api/auth/login", {
    email,
    password,
    // Remove role from login request if your backend doesn't need it
  });
  return res.data as LoginResponse;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: Exclude<Role, "admin">
) {
  const res = await api.post("/api/auth/register", {
    name,
    email,
    password,
    role: `ROLE_${role.toUpperCase()}`,
  });
  return res.data;
}
