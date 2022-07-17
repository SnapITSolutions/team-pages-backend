import { getConfig } from './config.js';
import getServer from './server/index.js';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import multer from 'fastify-multer';

const config = getConfig();
const server = getServer();

await server.register(helmet);
await server.register(cors);
await server.register(multer.contentParser);

await server.listen({ port: config.port, host: '0.0.0.0' });
