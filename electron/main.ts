import { app, BrowserWindow, ipcMain, screen } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
// import { waitForDebugger } from 'node:inspector'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  console.log(`[Main Process] Creating new browser window (Main Process PID: ${process.pid})...`);

  const mainScreen = screen.getPrimaryDisplay();
  const dimensions = mainScreen.workAreaSize;
  const windowWidth = 240;
  const windowHeight = 80;

  win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: dimensions.width - windowWidth - 10,
    y: dimensions.height - windowHeight - 100,
    frame: false, // 无边框窗口
    transparent: true, // 透明背景
    alwaysOnTop: true, // 窗口总在最前
    resizable: false,  // 禁止调整大小
    skipTaskbar: true, // (可选) 不在任务栏显示图标
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      // nodeIntegration: true, // 保持您项目原有的安全设置
      // contextIsolation: true, // 保持您项目原有的安全设置
    },
  })
  // win.webContents.openDevTools({ mode: 'detach' }); // 添加这行来自动打开开发者工具
  console.log(`[Main Process] Renderer process started with PID: ${win.webContents.getProcessId()}`);


  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    const rendererURL = win?.webContents.getURL();
    console.log(`[Main Process] Renderer process finished loading content from: ${rendererURL}`); // 添加日志
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  ipcMain.on('show-main-window', () =>{
    console.log(`[Main Process] Received show-main-window event.`);
  })

  if (VITE_DEV_SERVER_URL) {
    console.log(`[Main Process] Loading Renderer URL (Vite Dev Server): ${VITE_DEV_SERVER_URL}`); // 添加日志
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    const filePath = path.join(RENDERER_DIST, 'index.html');
    console.log(`[Main Process] Loading Renderer file: ${filePath}`); // 添加日志
    win.loadFile(filePath)
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  console.log('[Main Process] App is ready.'); // 添加日志
  createWindow();
})
