/*
 * @Descripttion: 
 * @version: 
 * @Author: MiKin
 * @Date: 2022-01-23 15:12:12
 * @LastEditors: MiKin
 * @LastEditTime: 2022-01-23 18:20:39
 * @FilePath: \Beauty\vite.config.ts
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Beauty/',
})
