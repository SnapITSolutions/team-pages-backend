import { FastifyReply, FastifyRequest } from 'fastify';
import joi from 'joi';
import { getConfig } from '../../config.js';
import * as db from '../../database/index.js';

type GetMemberParam = {
  id?: string;
};

const avgString = joi.string()
  .min(3)
  .max(20)
  .required();
const avgOptString = joi.string()
  .min(3)
  .max(20);
const avgParagraph = joi.string()
  .min(0)
  .max(2000)
  .required();

const memberData = joi.object({
  // Personal
  firstname: avgString,
  lastname: avgString,
  title: avgString,
  pronouns: avgOptString,

  interests: avgParagraph,
  joblikes: avgParagraph,
  // Socials
  linkedin: avgOptString,
});

function authCheck(
  req: FastifyRequest,
  rep: FastifyReply,
): boolean {
  const config = getConfig();
  const authed = (req.headers.authorization === config.token);
  if (!authed) {
    rep.code(400);
    rep.send({
      code: 'AUTHORIZATION',
      message: 'You do not have access to this endpoint.',
    });
  }

  return authed;
}

/**
 * GET /members
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
export async function getMembers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const members = await db.getMembers();
  reply.header('Content-Type', 'application/json');
  reply.send(members);
}

export async function postMembers(
  req: FastifyRequest,
  rep: FastifyReply,
): Promise<void> {
  if (!authCheck(req, rep)) { return; }
  const data = req.body as any;
  memberData.validate(data);
}

export async function putMember(
  req: FastifyRequest,
  rep: FastifyReply,
): Promise<void> {
  if (!authCheck(req, rep)) { return; }
  const data = req.body as any;
  memberData.validate(data);
}

/**
 * GET /members/:id
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
export async function getMember(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  function fail<T extends Object>(code: number, payload: T): void {
    reply.status(code);
    reply.send(payload);
  }

  reply.header('Content-Type', 'application/json');

  const { id } = request.params as GetMemberParam;
  console.debug(`Received "${id}"`);
  if (id === undefined) {
    fail(400, {
      code: 'MISSING_ID',
      message: 'The member ID was not provided.',
    });
    return;
  }

  const member = await db.getMember(id);
  if (member === null) {
    fail(404, {
      code: 'MEMBER_NOT_FOUND',
      message: 'The ID provided is not associated with a team member.',
    });
    return;
  }

  reply.status(200);
  reply.send(member);
}
