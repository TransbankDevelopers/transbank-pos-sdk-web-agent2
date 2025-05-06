/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './styles.css';
import { version } from '../package.json';
import { setupToggleLogs } from './renderer/toggle.logs'

document.title = `Agente POS v${version} - Transbank`;

window.electronAPI.onUpdateClientCount((count: number) => {
    console.log('count updated', count);
    document.getElementById('usersCount').innerText = count.toString();
});

window.electronAPI.onUpdateClientLog((data: string) => {
    const logSection = document.getElementById('logs');
    const newLogDetail = document.createElement('pre');
    const formattedTime = getFormattedTime();
    newLogDetail.classList.add('tbk-log-detail');
    newLogDetail.textContent = `${formattedTime} | ${data}`;

    console.log('Server log', data);
    logSection.insertBefore(newLogDetail, logSection.firstChild);
});

window.electronAPI.onUpdatePosStatus((posConnected: boolean) => {
    const posStatus = document.getElementById('posStatus');

    if(posConnected) {
        posStatus.classList.remove('status-disconnected');
        posStatus.classList.add('status-connected');
        posStatus.textContent = 'Conectado';
    }
    else {
        posStatus.classList.remove('status-connected');
        posStatus.classList.add('status-disconnected');
        posStatus.textContent = 'Desconectado';
    }
});

setupToggleLogs();

function getFormattedTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
