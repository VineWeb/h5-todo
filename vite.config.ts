import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import path from 'path';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      uni(),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.jsx', '.tsx', '.scss', '.vue'],
      alias: {
        "@": path.resolve(__dirname, 'src'),
        '~@': path.resolve(__dirname, 'src'),
      },
      allowImportingTsExtensions: true,
    },
    server: {
      host: 'localhost',
      port: 8080,
      cors: true,
      proxy: {
        '/todoapi': {
          target: env.VITE_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/todoapi/, '')
        }
      }
    }
  }
});