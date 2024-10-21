import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [AuthModule],
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService]
})
export class UserModule {}