import { PrismaClient } from '@prisma/client';

let client: null | PrismaClient = null;

export function getClient(): PrismaClient {
  if (client !== null) {
    return client;
  }
  client = new PrismaClient();
  return client;
}

export * from './avatars.js';
export * from './members.js';
