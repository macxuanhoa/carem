import { Prisma } from '@prisma/client';

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
