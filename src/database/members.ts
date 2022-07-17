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

export async function checkMember(id: string): Promise<boolean> {
  const client = getClient();
  const count = await client.teamMember.count({ where: { id } });
  return count > 0;
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
): Promise<TeamMember | null> {
  const client = getClient();
  try {
    const result = await client.teamMember.update({ where: { id }, data });
    return result;
  } catch (optErr) {
    const err = optErr as Error;
    if (err.message.includes('does not exist')) {
      return null;
    }
    throw err;
  }
}

export async function deleteMember(
  id: string,
): Promise<boolean> {
  const client = getClient();
  try {
    await client.teamMember.delete({ where: { id } });
    return true;
  } catch (optErr) {
    const err = optErr as Error;
    if (err.message.includes('does not exist')) {
      return false;
    }
    throw err;
  }
}
