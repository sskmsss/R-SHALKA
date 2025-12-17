import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Разрешаем доступ с любого хоста (для разработки)
    // В продакшене — лучше указать конкретный домен
    host: '0.0.0.0', // ← Обязательно для внешнего доступа
    port: 5173,
    // Разрешаем ngrok-адрес
    allowedHosts: [
      'krystin-unfrightening-nash.ngrok-free.dev' 
    ]
  }
})