import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [AuthModule, S3Module],
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService]
})
export class UserModule {}