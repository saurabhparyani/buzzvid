import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { Follower } from './follower.model';

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

  async followUser(followerId: number, followingId: number): Promise<User> {
    console.log(`Attempting to follow user. Follower ID: ${followerId}, Following ID: ${followingId}`);
    try {
      if (!followerId) {
        throw new Error('Follower ID is required');
      }
      const user = await this.prisma.user.update({
        where: { id: followerId },
        data: {
          following: {
            connect: { id: followingId },
          },
        },
        include: {
          following: true,
        },
      });
  
      if (!user) {
        throw new NotFoundException(`User with ID ${followerId} not found`);
      }
  
      console.log(`Successfully followed user. Follower ID: ${followerId}, Following ID: ${followingId}`);
      return user;
    } catch (error) {
      console.error(`Error following user:`, error);
      throw error;
    }
  }

  async unfollowUser(followerId: number, followingId: number): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          disconnect: { id: followingId },
        },
      },
      include: {
        following: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${followerId} not found`);
    }

    return user;
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        id: followerId,
        following: {
          some: {
            id: followingId,
          },
        },
      },
    });

    return count > 0;
  }

  async getFollowers(userId: number): Promise<Follower[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        followers: {
          select: {
            id: true,
            fullname: true,
            email: true,
            image: true,
            googleImage: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.followers;
  }

  async getFollowing(userId: number): Promise<User[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          include: {
            followers: true, // Include any other relations if needed
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.following;
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { fullname: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5, // Limit the results to 5 users
    });
  }
  
}