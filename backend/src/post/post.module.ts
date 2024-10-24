import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [S3Module],
  providers: [PostService, PostResolver, PrismaService, JwtService, ConfigService]
})
export class PostModule {}