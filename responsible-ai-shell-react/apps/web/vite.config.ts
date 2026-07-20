import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, type PluginOption } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import federation from "@originjs/vite-plugin-federation"

export default defineConfig(({ isSsrBuild }) => {
  // NOTE: The remote URL below uses a token "MFE_REMOTE_ENTRY_URL" as a placeholder.
  // The root start.js patches this value at container startup from the MFE_URL env var,
  // exactly like the Angular start.js patched webpack.config.js. Do NOT hardcode a URL here.
  const plugins: PluginOption[] = [tailwindcss(), tsconfigPaths(), reactRouter()]

  // Only apply Module Federation to the client build to prevent SSR build conflicts
  if (!isSsrBuild) {
    plugins.push(
      federation({
        name: "shell",
        remotes: {
          rAIFrontend: "http://localhost:30055/assets/remoteEntry.js",
        },
        shared: ["react", "react-dom", "react-router"],
      })
    )
  }

  return {
    plugins,
    build: {
      target: "esnext",
    },
    // @ts-ignore
    test: {
      globals: true,
      environment: "jsdom",
    },
  }
})
