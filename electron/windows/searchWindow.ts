import { BrowserWindow, app } from 'electron';
import path from 'node:path';

// 从 main.ts 移过来的相关常量或从配置文件读取
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const RENDERER_DIST = path.join(process.env.APP_ROOT!, 'dist');

let searchWin: BrowserWindow | null = null;

export function createSearchWindow(): BrowserWindow {
  if (searchWin && !searchWin.isDestroyed()) {
    searchWin.focus();
    return searchWin;
  }

  searchWin = new BrowserWindow({
    width: 900,
    height: 700,
    title: '知识库查询',
    // parent: getInitialWindow(), // 如果希望它成为主窗口的子窗口 (可选)
    // modal: true, // 如果希望它对父窗口是模态的 (可选)
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist-electron', 'preload.mjs'), // 确保路径正确
    },
  });

  // 假设您的知识库界面在 Vue Router 中的路径是 /search
  // 或者您为这个窗口准备了单独的 HTML 文件
  const searchUrlPath = '#/search'; // Vue Router hash 模式下的路径

  if (VITE_DEV_SERVER_URL) {
    searchWin.loadURL(`${VITE_DEV_SERVER_URL}${searchUrlPath}`);
  } else {
    searchWin.loadFile(path.join(RENDERER_DIST, 'index.html'), {
      hash: searchUrlPath.startsWith('#/') ? searchUrlPath.substring(1) : searchUrlPath,
    });
  }

  searchWin.on('closed', () => {
    searchWin = null;
  });

  // 您可以在这里添加特定于搜索窗口的事件
  searchWin.webContents.on('did-finish-load', () => {
    console.log('[SearchWindow] Content loaded.');
  });

  return searchWin;
}

export function getSearchWindow(): BrowserWindow | null {
  return searchWin;
}
