import { Menu, shell, app, MenuItemConstructorOptions } from "electron";
import { logDirectory } from "../logger/logger";
import {
  isAutoLaunchEnabled,
  toggleAutoLaunch,
} from "../auto-launch/auto.launch";

const isMacOs = process.platform === "darwin";
const isProd = process.env.NODE_ENV === "production";

const macOsMenu: MenuItemConstructorOptions = {
  label: app.name,
  submenu: [
    { role: "about", label: `Acerca de ${app.name}` },
    { type: "separator" },
    { role: "hide", label: `Ocultar ${app.name}`, accelerator: "CmdOrCtrl+H" },
    {
      role: "hideOthers",
      label: "Ocultar Otros",
      accelerator: "CmdOrCtrl+Alt+H"
    },
    { role: "unhide", label: "Mostrar Todos" },
    { type: "separator" },
    {
      role: "quit",
      label: `Salir de ${app.name}`,
      accelerator: "CmdOrCtrl+Q"
    }
  ]
};

const fileMenu: MenuItemConstructorOptions = {
  label: "Archivo",
  type: "submenu"
};

const openLogOption: MenuItemConstructorOptions = {
  label: "Abrir Carpeta de Logs",
  accelerator: "CmdOrCtrl+L",
  click: openLogFolder
};

const exitOption: MenuItemConstructorOptions = {
  label: "Salir",
  accelerator: "CmdOrCtrl+Q",
  role: "quit"
};

const createMenu = async function(): Promise<MenuItemConstructorOptions[]> {
  const menu = [];
  const fileSubMenu = [openLogOption];

  if (isMacOs) {
    menu.push(macOsMenu);
  }

  if (!isMacOs) {
    fileSubMenu.push(exitOption);
  }

  fileMenu.submenu = fileSubMenu;
  menu.push(fileMenu);

  if (isProd) {
    const autoLaunchOption = await getAutoLaunchOption();
    menu.push({
      label: "Opciones",
      type: "submenu",
      submenu: [autoLaunchOption]
    });
  }

  return menu;
}

const getAutoLaunchOption = async function(): Promise<MenuItemConstructorOptions> {
  const autoLaunchEnabled = await isAutoLaunchEnabled();
  return {
    label: "Arranque en el inicio",
    type: "checkbox",
    checked: autoLaunchEnabled,
    click: toggleAutoLaunch
  };
}

export async function setAppMenu(): Promise<void> {
  const template = await createMenu();
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function openLogFolder(): void {
  shell.openPath(logDirectory);
}
