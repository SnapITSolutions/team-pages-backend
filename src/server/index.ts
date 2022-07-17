import fastify, {
  FastifyInstance, FastifyRequest,
} from 'fastify';
import multer from 'fastify-multer';
import { File, FileFilterCallback } from 'fastify-multer/lib/interfaces';
import { getConfig } from '../config.js';
import { deleteAvatar, getAvatar, setAvatar } from './routes/avatars.js';
import {
  deleteMember,
  getMember,
  getMembers,
  headMember,
  postMembers,
  putMember,
} from './routes/index.js';
import { authguard as authCheck, idCheck } from './util.js';

// NOTE(dylhack): MB * MB in BYTES this
//                is currently 1 MB
const mxImgSize = 1 * 1000000;
const mimeTypes = ['image/gif', 'image/jpeg', 'image/png'];
const supported = mimeTypes.join(' ');
let svrinstance: null | FastifyInstance = null;

function addRoutes(): void {
  const server = getServer();
  const config = getConfig();

  // Member Endpoints
  server.post('/members', postMembers);
  server.get('/members', getMembers);
  server.head('/members/:id', idCheck(headMember));
  server.get('/members/:id', authCheck(idCheck(getMember)));
  server.put('/members/:id', authCheck(idCheck(putMember)));
  server.delete('/members/:id', authCheck(idCheck(deleteMember)));

  // Avatar Endpoints
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    dest: config.avatarPath,
    limits: {
      fileSize: mxImgSize,
      files: 1,
    },
    fileFilter: (req: FastifyRequest, file: File, callback: FileFilterCallback) => {
      if (!mimeTypes.includes(file.mimetype)) {
        callback(new Error(`Invalid file type. ${supported}`), false);
        return;
      }
      callback(null, true);
    },
  });
  server.get('/avatars/:id', idCheck(getAvatar));
  server.delete('/avatars/:id', authCheck(idCheck(deleteAvatar)));
  server.put('/avatars/:id', {
    preHandler: upload.single('avatar'),
    handler: authCheck(idCheck(setAvatar)),
  });
}

export default function getServer(): FastifyInstance {
  if (svrinstance !== null) {
    return svrinstance;
  }
  svrinstance = fastify({ logger: true });
  addRoutes();
  return svrinstance;
}
