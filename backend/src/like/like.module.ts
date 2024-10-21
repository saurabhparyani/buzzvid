import { Module } from '@nestjs/common';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [LikeResolver, LikeService, PrismaService]
})
export class LikeModule {}