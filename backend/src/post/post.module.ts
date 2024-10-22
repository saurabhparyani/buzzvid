import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Module({
  providers: [PostService, PostResolver, PrismaService, JwtService, ConfigService]
})
export class PostModule {}