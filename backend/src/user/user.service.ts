import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async updateProfile(
    userId: number,
    data: {fullname?:string;bio?:string;image?:string;}
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullname: data.fullname,
        bio: data.bio,
        image: data.image,
      },
    });
  }

  async updateGoogleProfile(
    userId: number,
    data: {fullname?:string;bio?:string;googleImage?:string;}
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullname: data.fullname,
        bio: data.bio,
        googleImage: data.googleImage,
      },
    });
  }
}