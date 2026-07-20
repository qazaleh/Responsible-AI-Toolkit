import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("workbench", "routes/workbench.tsx"),
  route("usecase", "routes/usecase.tsx"),
  route("models", "routes/models.tsx"),
  route("benchmarking", "routes/benchmarking.tsx"),
  route("configs", "routes/configs.tsx"),
] satisfies RouteConfig
