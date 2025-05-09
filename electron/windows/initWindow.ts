import { app, BrowserWindow, ipcMain, screen } from 'electron'
import path from 'node:path'

let win: BrowserWindow | null

export function createInitWindow(viteDevServerUrl: string, rendererDist: string, mainJsDir: string) {
  console.log(`[init window] creating new init window (PID: ${process.pid})...`);

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
      // preload: path.join(__dirname, 'preload.mjs'),
      preload: path.join(mainJsDir, 'preload.mjs'),
      // nodeIntegration: true, // 保持您项目原有的安全设置
      // contextIsolation: true, // 保持您项目原有的安全设置
    },
  })
  // win.webContents.openDevTools({ mode: 'detach' }); // 添加这行来自动打开开发者工具
  console.log(`[Main Process] Renderer process started with PID: ${win.webContents.getProcessId()}`);
  console.log(`[Main Process] APP_ROOT: ${process.env.APP_ROOT}`);


  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    const rendererURL = win?.webContents.getURL();
    console.log(`[Main Process] Renderer process finished loading content from: ${rendererURL}`); // 添加日志
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  ipcMain.on('show-main-window', () =>{
    console.log(`[Main Process] Received show-main-window event.`);
  })

  if (viteDevServerUrl) {
    console.log(`[Main Process] Loading Renderer URL (Vite Dev Server): ${viteDevServerUrl}`); // 添加日志
    win.loadURL(viteDevServerUrl)
  } else {
    const filePath = path.join(rendererDist, 'index.html');
    console.log(`[Main Process] Loading Renderer file: ${filePath}`); // 添加日志
    win.loadFile(filePath)
  }

  return win
}
