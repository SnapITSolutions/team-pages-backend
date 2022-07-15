import { Prisma, TeamMember } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import joi from 'joi';
import { getConfig } from '../../config.js';
import * as db from '../../database/index.js';

type GetMemberParam = {
  id?: string;
};

const avgString = joi.string()
  .max(50)
  .trim()
  .required();
const avgOptString = joi.string()
  .max(50)
  .trim()
  .optional();
const avgParagraph = joi.string()
  .min(0)
  .max(2000)
  .trim()
  .required();
const avgLink = joi.string()
  .pattern(/[A-z0-9.-_]/)
  .max(50)
  .trim()
  .lowercase()
  .optional();

const memberData = joi.object({
  // Personal
  firstName: avgString,
  lastName: avgString,
  jobLikes: avgParagraph,
  interests: avgParagraph,
  pronouns: avgOptString,
  // Job
  title: avgString,
  startYear: joi.number()
    .min(2005)
    .max(3000)
    .integer()
    .positive()
    .required(),
  wasApprentice: joi.boolean()
    .required(),
  // Socials
  linkedin: avgLink,
  github: avgLink,
  youtube: avgLink,
  instagram: avgLink,
  personal: joi.string()
    .optional()
    .uri(),
});

function authCheck(
  req: FastifyRequest,
  rep: FastifyReply,
): boolean {
  const config = getConfig();
  const split = (req.headers.authorization || '').split(' ');
  const token = split[1];
  const authed = token === config.token;
  if (!authed) {
    rep.code(400);
    rep.send({
      code: 'AUTHORIZATION',
      message: 'You do not have access to this endpoint.',
    });
  }

  return authed;
}

function getId(req: FastifyRequest, rep: FastifyReply): string | null {
  const { id } = req.params as GetMemberParam;
  if (id === undefined) {
    rep.status(400);
    rep.send({
      code: 'MISSING_ID',
      message: 'The member ID was not provided.',
    });
    return null;
  }
  return id;
}

function checkMemberData<T>(
  req: FastifyRequest,
  rep: FastifyReply,
): T[] | null {
  function validate(data: T): T | null {
    const result = memberData.validate(data);
    if (result.error !== undefined) {
      rep.code(400);
      rep.send({
        code: 'INVALID_BODY',
        message: 'The body is invalid.',
        data: result,
      });
      return null;
    }
    return result.value;
  }

  const result: T[] = [];
  const members = req.body instanceof Array
    ? req.body as T[]
    : [req.body as T];
  if (members.length === 0) {
    rep.code(400);
    rep.send({
      code: 'NO_BODY',
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

/**
 * GET /members
 * @param {FastifyRequest} req
 * @param {FastifyReply} rep
 */
export async function getMembers(
  req: FastifyRequest,
  rep: FastifyReply,
): Promise<void> {
  const members = await db.getMembers();
  rep.send(members);
}

/**
 * GET /members/:id
 * @param {FastifyRequest} req
 * @param {FastifyReply} rep
 */
export async function getMember(
  req: FastifyRequest,
  rep: FastifyReply,
): Promise<void> {
  function fail<T extends Object>(code: number, payload: T): void {
    rep.status(code);
    rep.send(payload);
  }

  const { id } = req.params as GetMemberParam;
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

  rep.status(200);
  rep.send(member);
}

/**
 * POST /members
 * @param {FastifyRequest} req
 * @param {FastifyReply} rep
 */
export async function postMembers(
  req: FastifyRequest,
  rep: FastifyReply,
): Promise<void> {
  if (!authCheck(req, rep)) { return; }
  const data = checkMemberData<Prisma.TeamMemberCreateInput>(req, rep);
  if (data === null) {
    return;
  }
  const tasks: Promise<any>[] = [];
  const resp: TeamMember[] = [];
  data.forEach((member) => {
    const task = db.addMember(member);
    task.then((full) => resp.push(full));
    tasks.push(task);
  });
  await Promise.all(tasks);
  rep.status(200);
  rep.send(resp);
}

/**
 * PUT /members/:id
 * @param {FastifyRequest} req
 * @param {FastifyReply} rep
 */
export async function putMember(
  req: FastifyRequest,
  rep: FastifyReply,
): Promise<void> {
  if (!authCheck(req, rep)) { return; }
  const optData = checkMemberData<Prisma.TeamMemberCreateInput>(req, rep);
  const id = getId(req, rep);
  if (optData === null || id === null) {
    return;
  }
  const [data] = optData;
  const member = await db.setMember(id, data);
  rep.status(200);
  rep.send(member);
}

/**
 * DELETE /members/:id
 * @param {FastifyRequest} req
 * @param {FastifyReply} rep
 */
export async function deleteMember(
  req: FastifyRequest,
  rep: FastifyReply,
): Promise<void> {
  if (!authCheck(req, rep)) { return; }
  const id = getId(req, rep);
  if (id === null) {
    return;
  }
  const deleted = await db.deleteMember(id);
  rep.status(deleted ? 200 : 404);
  rep.send();
}
