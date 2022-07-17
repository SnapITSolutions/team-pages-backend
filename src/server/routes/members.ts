import { Prisma, TeamMember } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as db from '../../database/index.js';
import { checkMemberData } from '../util.js';

/**
 * GET /members
 * @param {FastifyRequest} req
 * @param {FastifyReply} rep
 */
export async function getMembers(
  _: FastifyRequest,
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
  id: string,
): Promise<void> {
  const fail = <T>(code: number, payload: T): void => {
    rep.status(code);
    rep.send(payload);
  };

  const member = await db.getMember(id);
  if (member === null) {
    fail(404, {
      errcode: 'MEMBER_NOT_FOUND',
      message: 'The ID provided is not associated with a team member.',
    });
    return;
  }

  rep.status(200);
  rep.send(member);
}

/**
 * HEAD /members/:id
 * @param req
 * @param rep
 * @param id
 */
export async function headMember(
  req: FastifyRequest,
  rep: FastifyReply,
  id: string,
): Promise<void> {
  const exists = await db.checkMember(id);
  rep.status(exists ? 200 : 404);
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
 * @param {string} id
 */
export async function putMember(
  req: FastifyRequest,
  rep: FastifyReply,
  id: string,
): Promise<void> {
  const optData = checkMemberData<Prisma.TeamMemberCreateInput>(req, rep);
  if (optData === null) {
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
  id: string,
): Promise<void> {
  const deleted = await db.deleteMember(id);
  rep.status(deleted ? 200 : 404);
  rep.send();
}
