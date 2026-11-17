import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // GitHub Pages публикует сайт по адресу /имя-репозитория/, поэтому на сборке
  // ставим base автоматически; для локального запуска base остаётся "/"
  base: command === 'build' ? '/CRM/' : '/',
  plugins: [react()],
  server: { host: true, port: 5173, strictPort: true, allowedHosts: true },
  preview: { host: true, port: 4173, strictPort: true, allowedHosts: true },
}))
