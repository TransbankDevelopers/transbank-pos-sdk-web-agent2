
import * as socketIo from "socket.io";
import WindowsManager from "../windows.manager";
import { version } from '../../package.json';
import PosHandler from "./pos.handler";
import pos from "../pos";

const PORT = 8090;
const cors = {
  origin: (origin, callback) => {
    callback(null, origin);
  },
  methods: ['GET', 'POST'],
  credentials: true
};

export default class PosServer {
  io: socketIo.Server;
  posHandler: PosHandler;
  constructor() {
    this.io = new socketIo.Server(PORT, { cors, allowEIO3: true });
    this.posHandler = new PosHandler(this.io, pos);
  }
  start(): void {
    let clientsCount = 0;

    function updateClientCount(count) {
      clientsCount = count;
      const windowsManager = WindowsManager.getMainWindow();
      if (windowsManager) {
        windowsManager.webContents.send("count", count);
      }
    }

    function updatePosConnectionStatus(connected: boolean): void {
      const windowsManager = WindowsManager.getMainWindow();
      if (windowsManager) {
        windowsManager.webContents.send("pos_status", connected);
      }
    }

    this.io.on("connection", (socket) => {
      updateClientCount(clientsCount + 1);

      pos.on("port_opened", (port) => {
        this.io.emit("event.port_opened", port);
        updatePosConnectionStatus(true);
      });

      pos.on("port_closed", () => {
        this.io.emit("event.port_closed");
        updatePosConnectionStatus(false);
      });

      socket.on("disconnect", () => {
        updateClientCount(clientsCount - 1);
      });

      socket.on("getVersion", () => {
        this.io.emit("getVersion.response", version);
      });

      socket.on("openPort", ({ port, baudrate, eventName }) => {
        this.posHandler.openPort(port, baudrate, eventName);
      });

      socket.on("closePort", ({ eventName }) => {
        this.posHandler.closePort(eventName);
      });

      socket.on("getPortStatus", ({ eventName }) => {
        this.posHandler.getPortStatus(eventName);
      });

      socket.on("listPorts", ({ eventName }) => {
        this.posHandler.listPorts(eventName);
      });

      socket.on("autoconnect", ({ baudrate, eventName }) => {
        this.posHandler.autoConnect(baudrate, eventName);
      });

      socket.on("poll", ({ eventName }) => {
        this.posHandler.poll(eventName);
      });

      socket.on("loadKeys", ({ eventName }) => {
        this.posHandler.loadKeys(eventName);
      });

      socket.on("closeDay", ({ eventName }) => {
        this.posHandler.closeDay(eventName);
      });

      socket.on("getTotals", ({ eventName }) => {
        this.posHandler.getTotals(eventName);
      });

      socket.on("getLastSale", ({ eventName }) => {
        this.posHandler.getLastSale(eventName);
      });

      socket.on("salesDetail", ({ printOnPos, eventName }) => {
        this.posHandler.salesDetail(printOnPos, eventName);
      });

      socket.on("refund", ({ operationId, eventName }) => {
        this.posHandler.refund(operationId, eventName);
      });

      socket.on("changeToNormalMode", ({ eventName }) => {
        this.posHandler.changeToNormalMode(eventName);
      });

      socket.on("sale", ({ amount, ticket, eventName }) => {
        this.posHandler.sale(amount, ticket, eventName);
      });

      socket.on(
        "multicodeSale",
        ({ amount, ticket, commerceCode = "0", eventName }) => {
          this.posHandler.multicodeSale(amount, ticket, commerceCode, eventName);
        }
      );
    });
  }
}
