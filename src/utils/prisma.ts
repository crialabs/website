import { PrismaAdapter as _PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient, Prisma } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// @NOTE: this is module extension
// required to alter prisma adapter
export const PrismaAdapter = (p: PrismaClient) => ({
  ..._PrismaAdapter(p),
  getUser: (id: string) =>
    p.user.findUnique({
      where: { id: +id },
      select: {
        colorSchema: true,
      },
    }),
});

export default prisma;
