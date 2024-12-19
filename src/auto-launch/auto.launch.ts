import { app } from "electron";
import AutoLaunch from "auto-launch";

const isProd = process.env.NODE_ENV === "production";

let autoLauncher = null;

export function setupAutoLaunch(): void {
  if (isProd) {
    autoLauncher = new AutoLaunch({
      name: app.name,
      path: app.getPath("exe"),
      mac: {
        useLaunchAgent: true
      }
    });
  }
}

export async function isAutoLaunchEnabled(): Promise<boolean> {
  if (autoLauncher) {
    return autoLauncher
      .isEnabled()
      .then((enabled: boolean) => {
        return enabled;
      })
      .catch((error: Error) => {
        console.log("Error checking auto-launch status:", error);
        return false;
      });
  }
  return false;
}

export async function toggleAutoLaunch(): Promise<void> {
  try {
    const enabled = await isAutoLaunchEnabled();

    if (!autoLauncher) {
      return;
    }

    if (enabled) {
      await autoLauncher
        .disable()
        .then(() => {
          console.log("Arranque en el inicio deshabilitado.");
        })
        .catch((error) => {
          console.log("Error al deshabilitar el arranque automático:", error);
        });
    } else {
      await autoLauncher
        .enable()
        .then(() => {
          console.log("Arranque en el inicio habilitado.");
        })
        .catch((error) => {
          console.log("Error al habilitar el arranque automático:", error);
        });
    }
  } catch (error) {
    console.log("Error al verificar el estado de arranque automático:", error);
  }
}
