import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export const userModel = prismaClient.user;
export const shareModel = prismaClient.share;
export const userShareModel = prismaClient.userShare;
export const portfolioModel = prismaClient.portfolio;
export const transactionModel = prismaClient.transaction;