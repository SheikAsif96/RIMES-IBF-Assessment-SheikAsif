import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client.js";

export function useRegister() {
  return useMutation({
    mutationFn: (data) => api.post("/auth/register", data).then((r) => r.data),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (data) => api.post("/auth/login", data).then((r) => r.data),
  });
}

export function useArticles(params) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: () => api.get("/api/articles", { params }).then((r) => r.data),
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post("/api/articles", data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateArticle(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      api.put(`/api/articles/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/articles/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get("/api/stats").then((r) => r.data),
    refetchInterval: 10000,
  });
}
