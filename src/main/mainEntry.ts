import { app, BrowserWindow } from 'electron'
import type { BrowserWindowConstructorOptions } from 'electron'
// 隐藏渲染进程开发者调试工具的警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
let mainWindow: BrowserWindow

app.whenReady().then(() => {
  const config: BrowserWindowConstructorOptions = {
    webPreferences: {
      // 将node环境集成到渲染进程中
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true
    }
  }
  mainWindow = new BrowserWindow(config)
  mainWindow.webContents.openDevTools({ mode: 'undocked' })
  mainWindow.loadURL(process.argv[2])
})