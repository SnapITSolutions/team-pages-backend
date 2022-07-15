import { Prisma, TeamMember } from '@prisma/client';
import { getClient } from './index.js';

export async function getMembers(): Promise<TeamMember[]> {
  const client = getClient();
  const result = await client.teamMember.findMany();
  console.debug('Resolved members', result);
  return result;
}

export async function getMember(id: string): Promise<TeamMember | null> {
  const client = getClient();
  const result = await client.teamMember.findFirst({ where: { id } });
  console.debug('Resolved member', result);
  return result;
}

export async function addMember(
  data: Prisma.TeamMemberCreateInput,
): Promise<TeamMember> {
  const client = getClient();
  const result = await client.teamMember.create({ data });
  return result;
}

export async function setMember(
  id: string,
  data: Prisma.TeamMemberCreateInput,
): Promise<TeamMember> {
  const client = getClient();
  const result = await client.teamMember.update({ where: { id }, data });
  return result;
}
