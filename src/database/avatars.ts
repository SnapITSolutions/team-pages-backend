import { FastifyReply } from "fastify";
import { getConfig } from "../config.js";
import fs from "node:fs/promises";
import path from "node:path";
import { Avatar } from "@prisma/client";
import { getClient } from "./index.js";

export function createAvatarPath(idOrFile: string, ext?: string): string {
  const config = getConfig();
  const absolute = path.join(
    config.avatarPath,
    ext !== undefined ? `${idOrFile}.${ext}`: idOrFile,
  );
  return absolute;
}

export async function getAvatarPath(
  id: string,
  rep?: FastifyReply,
): Promise<string | null> {
  const config = getConfig();
  const files = await fs.readdir(config.avatarPath);
  for (let i = 0; i < files.length; i += 1) {
    const fileName = files[i];
    const absolute = path.join(config.avatarPath, fileName);
    const [name] = fileName.split('.');

    if (name === id) {
      return path.resolve(absolute);
    }
  }

  if (rep !== undefined) {
    rep.status(404);
    await rep.send({
      errcode: 'NOT_FOUND',
      message: 'This user does not have an avatar.',
    });
  }

  return null;
}

export async function getAvatar(id: string): Promise<Avatar | null> {
  const client = getClient();
  return client.avatar.findFirst({ where: { memberId: id }});
}

export async function setAvatar(id: string, filename: string): Promise<void> {
  const client = getClient();
  const count = await client.avatar.count({ where: { memberId: id }});
  if (count > 0) {
    await client.avatar.update({
      where: { memberId: id },
      data: {
        filename,
        memberId: id,
      },
    });
  } else {
    await client.avatar.create({
      data: {
        filename,
        memberId: id,
      },
    });
  }
}
