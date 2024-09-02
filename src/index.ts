import path from "path";
import url from "url";
import { app, BrowserWindow, nativeImage, Tray, Menu, protocol, net } from "electron";
import WindowsManager from "./windows.manager";
import PosServer from "./server/pos.server";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

const posServer = new PosServer();
const originalConsoleLog = console.log;

console.log = (...args) => {
  originalConsoleLog(...args);

  const windowsManager = WindowsManager.getMainWindow();
  if (windowsManager !== null) {
    windowsManager.webContents.send('log', [...args])
  }
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 480,
    width: 640,
    icon: getAppIcon(),
    resizable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.removeMenu();

  WindowsManager.setMainWindow(mainWindow);

  let tray = null;
  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
    tray = createTray(mainWindow);
  });

  mainWindow.on('restore', () => {
    mainWindow.show();
    tray.destroy();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  posServer.start();
};

protocol.registerSchemesAsPrivileged([
  { scheme: 'media-loader', privileges: { bypassCSP: true } }
])

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  
  if(process.platform == "darwin") {
    app.dock.setIcon(getAssetPath("icon.png"));
  }

  protocol.handle("media-loader", (request) => {
    const filePath = request.url.slice('media-loader://'.length)
    console.log(path.join(__dirname, filePath));
    return net.fetch(url.pathToFileURL(path.join(__dirname, filePath)).toString())
  });

  createWindow()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function getAssetPath(icon = ''): string {
  const iconPath = path.join(__dirname, `/assets/icons/${icon}`);
  return iconPath;
}

function getAppIcon(): string {
  switch (process.platform) {
    case "win32":
      return getAssetPath("icon.ico");
    case "darwin":
      return getAssetPath("icon.icns");
    default:
      return getAssetPath("icon.png");
  }
}

const createTray = (window: BrowserWindow) => {
  const tray = new Tray(createNativeImage());
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar', click: function () {
        window.show();
      }
    },
    {
      label: 'Salir', click: function () {
        app.quit();
      }
    }
  ]);

  tray.on('double-click', function () {
    window.show();
  });

  tray.setContextMenu(contextMenu);
  return tray;
}

const createNativeImage = () => {
  const icon: string = process.platform === 'win32' ? 'winTrayIcon.png' : 'trayIcon.png';
  const appIcon: string = path.join(__dirname, `/assets/icons/trayIcons/${icon}`)

  const image = nativeImage.createFromPath(appIcon);

  image.setTemplateImage(true);

  return image;
}