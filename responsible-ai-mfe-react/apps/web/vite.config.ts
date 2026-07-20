import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, type PluginOption } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import federation from "@originjs/vite-plugin-federation"

export default defineConfig(({ isSsrBuild }) => {
  const plugins: PluginOption[] = [tailwindcss(), tsconfigPaths(), reactRouter()]

  // Only apply Module Federation to the client build to prevent SSR build conflicts
  if (!isSsrBuild) {
    plugins.push(
      federation({
        name: "rAIFrontend",
        filename: "remoteEntry.js",
        exposes: {
          "./Workbench": "./app/components/workbench/WorkbenchView.tsx",
          "./UseCases": "./app/components/use-cases/UsecaseView.tsx",
          "./Models": "./app/components/ai-models/ModelsView.tsx",
          "./Benchmarking": "./app/components/benchmarking/BenchmarkingView.tsx",
          "./Configs": "./app/components/configs/ConfigsView.tsx",
          "./RemoteMfeModule": "./app/routes/home.tsx",
        },
        shared: ["react", "react-dom", "react-router"],
      })
    )
  }

  return {
    resolve: { tsconfigPaths: true },
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
