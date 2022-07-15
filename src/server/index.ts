import fastify, { FastifyInstance } from 'fastify';
import {
  getMember, getMembers,
  postMembers, putMember,
} from './routes/index.js';

let svrinstance: null | FastifyInstance = null;

function addRoutes(): void {
  const server = getServer();
  server.post('/members', postMembers);
  server.get('/members', getMembers);
  server.put('/members/:id', putMember);
  server.get('/members/:id', getMember);
}

export default function getServer(): FastifyInstance {
  if (svrinstance !== null) {
    return svrinstance;
  }
  svrinstance = fastify({ logger: true });
  addRoutes();
  return svrinstance;
}
