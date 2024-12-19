import { app } from "electron";
import path from "path";
import winston from "winston";
import "winston-daily-rotate-file";

const logDirectory = app.getPath("logs");

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDirectory, "%DATE%.log"),
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d"
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [new winston.transports.Console(), dailyRotateFileTransport]
});

export { logDirectory };
export default logger;
