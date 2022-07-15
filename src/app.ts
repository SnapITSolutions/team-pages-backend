import { getConfig } from './config.js';
import getServer from './server/index.js';

const config = getConfig();
const server = getServer();

await server.listen({ port: config.port, host: '0.0.0.0' });
