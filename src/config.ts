import path from 'node:path';
import fs from 'node:fs';

export type Config = {
  port: number;
  token: string;
  mode: string;
  avatarPath: string;
  fileLimit: number;
}

let config: null | Config = null;

function getAvatarFolder(): string {
  let avatarPath = process.env.AVATARS;
  if (avatarPath === undefined) {
    avatarPath = path.join(process.cwd(), './avatars');
    console.warn(`Defaulting avatars folder to ${avatarPath}`);
  }
  if (!fs.existsSync(avatarPath)) {
    fs.mkdirSync(avatarPath);
  }

  return avatarPath;
}

function getPort(): number {
  const port = Number(process.env.PORT || '3001');
  if (!Number.isInteger(port)) {
    console.warn(
      'The port provided is not a valid whole number.' + 
      ' Using 3001 instead.',
    );
    return 3001;
  }
  return port;
}

function getMode(): string {
  let mode = process.env.SERVER_MODE;
  if (mode === undefined) {
    console.warn('SERVER_MODE not set. Defaulting to dev');
    mode = 'dev';
  }
  return mode;
}

function getToken(mode: string): string {
  let token = process.env.TOKEN;
  if (token === undefined && mode === 'prod') {
    throw new Error('If SERVER_MODE is prod then a token should be set.');
  } else if (token === undefined) {
    token = 'DEV_TOKEN';
    console.info(`Access token is ${token}`);
  }
  return token;
}

function getFileSize(): number {
  let size = process.env.FILE_SIZE_LIMIT;
  if (size === undefined) {
    size = '8';
    console.warn('File size limit defaulted to 8MB');
  }
  let bytes = Number(size);
  if (Number.isNaN(bytes)) {
    throw new Error('The file size limit provided is not a number.');
  }
  return bytes * 1000000;
}

export function getConfig(): Config {
  if (config !== null) {
    return config;
  }
  const port = getPort();
  const mode = getMode();
  const avtp = getAvatarFolder();
  const size = getFileSize();
  const token = getToken(mode);

  config = {
    token, port, mode, 
    avatarPath: avtp,
    fileLimit: size,
  };

  return config;
}
