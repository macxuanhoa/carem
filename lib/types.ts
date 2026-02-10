import { Prisma } from '@prisma/client';
import { DefaultSession } from 'next-auth';

// Define a type that includes the relations we commonly use
export type CarWithRelations = Prisma.XeMuaVaoGetPayload<{
  include: {
    banRa: true;
    hoSo: true;
    chiPhi: true;
    gopVon: true;
    lichSu: true;
  }
}>;

// Extend NextAuth Types
declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user']
  }
}
