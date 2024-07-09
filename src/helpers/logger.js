import pino from 'pino';
import pinoPretty from 'pino-pretty';
import pinoCaller from 'pino-caller';
import path from 'path';
import fs from 'fs';

const projectRoot = findProjectRoot(import.meta.url);

export const logger = pinoCaller(
  pino({}, pinoPretty({
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss",
  })),
  {
    relativeTo: `file:///${projectRoot.replace(/\\/g, "/")}`
  }
);

function findProjectRoot(currentPath) {
  if (process.env.BASE_PATH) {
    return process.env.BASE_PATH;
  }

  if (fs.existsSync(path.join(currentPath, "package.json"))) {      
    console.log("CurrentDir catched", currentPath);
    return currentPath;
  }

  const parentDir = path.resolve(currentPath, "..");

  if (parentDir === currentPath) {
    throw new Error("Root not found");
  }

  return findProjectRoot(parentDir);

}