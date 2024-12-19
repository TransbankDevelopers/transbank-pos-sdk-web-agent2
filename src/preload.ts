// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateClientCount: (callback: (count: number) => void) => {
    ipcRenderer.on("count", (event, data) => {
      callback(data);
    });
  },

  onUpdateClientLog: (callback: (data: string) => void) => {
    ipcRenderer.on("log", (event, data) => {
      callback(data);
    });
  },

  onUpdatePosStatus: (callback: (posConnected: boolean) => void) => {
    ipcRenderer.on("pos_status", (event, posConnected) => {
      callback(posConnected);
    });
  }
});
