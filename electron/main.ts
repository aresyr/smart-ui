import { app, BrowserWindow, ipcMain, screen } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
// import { waitForDebugger } from 'node:inspector'

// const require = createRequire(import.meta.url)
const MAIN_JS_DIR = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(MAIN_JS_DIR, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'] || ``
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

import { createInitWindow } from './windows/initWindow'

let win: BrowserWindow | null

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

console.log(`[main process] creating new init window (Main Process PID: ${process.pid})...`);
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    win = createInitWindow(VITE_DEV_SERVER_URL, RENDERER_DIST, MAIN_JS_DIR)
  }
})

app.whenReady().then(() => {
  console.log('[Main Process] App is ready.'); // 添加日志
  win = createInitWindow(VITE_DEV_SERVER_URL, RENDERER_DIST, MAIN_JS_DIR);
})
