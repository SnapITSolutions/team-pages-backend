import { FastifyReply, FastifyRequest } from 'fastify';
import * as valid from '../joi/index.js';
import { getConfig } from '../config.js';

type GetMemberParam = {
  id?: string;
};

type RouteHandler<T> = (req: FastifyRequest, rep: FastifyReply) => T

type RouteHandlerId<T> = (req: FastifyRequest, rep: FastifyReply, id: string) => T

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
