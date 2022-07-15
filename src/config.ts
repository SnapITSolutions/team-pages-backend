export type Config = {
  port: number;
  token: string;
  mode: string;
}

let config: null | Config = null;

export function getConfig(): Config {
  if (config !== null) {
    return config;
  }
  const port = Number(process.env.PORT || '3001');
  let mode = process.env.SERVER_MODE;
  if (mode === undefined) {
    console.warn('SERVER_MODE not set. Defaulting to dev');
    mode = 'dev';
  }

  let token = process.env.TOKEN;
  if (token === undefined && mode === 'prod') {
    throw new Error('If SERVER_MODE is prod then a token should be set.');
  } else if (token === undefined) {
    token = 'DEV_TOKEN';
    console.info(`Access token is ${token}`);
  }

  config = {
    token, port, mode,
  };
  return config;
}
