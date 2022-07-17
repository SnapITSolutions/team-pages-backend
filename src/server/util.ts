import { FastifyReply, FastifyRequest } from 'fastify';
import joi from 'joi';
import { getConfig } from '../config.js';

type GetMemberParam = {
  id?: string;
};

type RouteHandler<T> = (req: FastifyRequest, rep: FastifyReply) => T

type RouteHandlerId<T> = (req: FastifyRequest, rep: FastifyReply, id: string) => T

const avgString = joi.string()
  .max(50)
  .trim()
  .required();
const avgOptString = joi.string()
  .max(50)
  .trim()
  .optional();
const avgParagraph = joi.string()
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

export function checkMemberData<T>(
  req: FastifyRequest,
  rep: FastifyReply,
): T[] | null {
  const validate = (data: T): T | null => {
    const result = memberData.validate(data);
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

export function authguard<T>(
  handler: RouteHandler<T>,
): RouteHandler<void> {
  // TODO(dylhack): authcheck will integrate with Google OAuth
  //                when we allow team members to update their
  //                own details at a later date.
  return (req: FastifyRequest, rep: FastifyReply): void => {
    const config = getConfig();
    const split = (req.headers.authorization || '').split(' ');
    const token = split[1];
    const authed = token === config.token;
    if (!authed) {
      rep.code(401);
      rep.send({
        errcode: 'AUTHORIZATION',
        message: 'You do not have access to this endpoint.',
      });
      return;
    }

    handler(req, rep);
  };
}

export function idCheck<T>(
  handler: RouteHandlerId<T>,
): RouteHandler<void> {
  return (req: FastifyRequest, rep: FastifyReply): void => {
    const { id } = req.params as GetMemberParam;
    if (id === undefined) {
      rep.status(400);
      rep.send({
        errcode: 'MISSING_ID',
        message: 'The member ID was not provided.',
      });
      return;
    }

    handler(req, rep, id);
  };
}
