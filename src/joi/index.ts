import { FastifyReply, FastifyRequest } from 'fastify';
import postMemberData from './memberdata.js';
import putMemberData from './putmemberdata.js';

export default function checkMemberData<T>(
  req: FastifyRequest,
  rep: FastifyReply,
): T[] | null {
  const validate = (data: T): T | null => {
    const result = req.method === "PUT" 
      ? putMemberData.validate(data)
      : postMemberData.validate(data);
    if (result.error !== undefined) {
      rep.code(400);
      rep.send({
        errcode: 'INVALID_BODY',
        message: 'The body is invalid check details.',
        details: result,
      });
      return null;
    }
    return result.value;
  };

  const result: T[] = [];
  const members = req.body instanceof Array
    ? req.body as T[]
    : [req.body as T];
  if (members.length === 0) {
    rep.code(400);
    rep.send({
      errcode: 'NO_BODY',
      message: 'A body was not provided.',
    });
    return null;
  }

  for (let i = 0; i < members.length; i += 1) {
    const member = members[i];
    const clean = validate(member);
    if (clean === null) {
      return null;
    }
    result.push(clean);
  }

  return result;
}
