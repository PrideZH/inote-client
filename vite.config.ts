import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const envResolve = (mode: string, env: string) => loadEnv(mode, process.cwd())[env];

// https://vitejs.dev/config/
export default ({ command, mode }) =>{
  return defineConfig({
    define: {
      'process.env': process.env
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
      }
    },
    server: {
      port: 3001,
      open: false, //自动打开
      base: "./ ", //生产环境路径
      proxy: { // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        '^/api': {
          target: envResolve(mode, 'VITE_APP_BASE_URL'),
          changeOrigin: true, //开启代理
          secure: false,
          rewrite: (path) => path.replace('/^\/api/', '')
        }
      }
    },
  });
}
