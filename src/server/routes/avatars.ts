import { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'node:fs/promises';
import path from 'node:path';
import { File } from 'fastify-multer/lib/interfaces';
import { getConfig } from '../../config.js';
import { checkMember } from '../../database/members.js';
import { existsSync } from 'node:fs';

function createAvatarPath(idOrFile: string, ext?: string): string {
  const config = getConfig();
  const absolute = path.join(
    config.avatarPath,
    ext !== undefined ? `${idOrFile}.${ext}`: idOrFile,
  );
  return absolute;
}

async function getAvatarPath(
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

export async function setAvatar(
  req: FastifyRequest,
  rep: FastifyReply,
  id: string,
): Promise<void> {
  const exists = await checkMember(id);
  if (!exists) {
    rep.code(400);
    rep.send({
      code: 'MEMBER_NOT_FOUND',
      message: 'The ID provided is not associated with a team member.',
    });
    return;
  }

  // @ts-ignore
  const file = req.file as File;
  const imgP = await getAvatarPath(id);
  const ext = path.extname(file.originalname).substring(1);

  if (ext.length === 0) {
    rep.code(400);
    rep.send({
      errcode: 'NO_EXT',
      message: 'The filename provided does not have a file extension.',
    });
    return;
  }

  if (file.buffer === undefined) {
    rep.code(400);
    rep.send({
      errcode: 'NO_BODY',
      message: 'The file provided does not have data.',
    });
    return;
  }

  const dest = createAvatarPath(id, ext);
  await fs.writeFile(dest, file.buffer);

  rep.status(200);
  rep.send();
  if (imgP !== null) {
    await fs.unlink(imgP).catch(console.error);
  }
}

export async function deleteAvatar(
  _: FastifyRequest,
  rep: FastifyReply,
  id: string,
): Promise<void> {
  const imgP = await getAvatarPath(id, rep);
  if (imgP === null) {
    return;
  }
  await fs.unlink(imgP);
  rep.status(200);
  rep.send();
}

export async function getAvatar(
  _: FastifyRequest,
  rep: FastifyReply,
  fileName: string,
): Promise<void> {
  const imgPath = createAvatarPath(fileName);
  const exists = existsSync(imgPath)
  if (!exists) {
    rep.status(404);
    await rep.send({
      errcode: 'NOT_FOUND',
      message: 'This user does not have an avatar.',
    });
    return;
  }
  const ext = path.extname(fileName).substring(1);
  const data = await fs.readFile(imgPath);
  rep.header('Content-Type', `image/${ext}`);
  rep.send(data);
}
