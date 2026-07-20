import { type RouteConfig, index, route, layout } from "@react-router/dev/routes"

export default [
  route("login", "routes/login.tsx"),
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("account/settings", "routes/settings.tsx"),
    route("account/password", "routes/password.tsx"),
    route("responsible-ui/*", "routes/mfe.tsx"),
    route("admin/*", "routes/admin.tsx"),
  ]),
] satisfies RouteConfig
