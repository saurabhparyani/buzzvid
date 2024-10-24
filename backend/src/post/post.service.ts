/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from '../prisma.service';
import { createWriteStream, ReadStream } from 'fs';
import { PostDetails, PostType } from './post.type';
import { CreatePostDto } from './create-post.dto';
import { Post } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import { S3_BUCKET_NAME } from 'src/config/aws.config';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService, private s3Service: S3Service) {}
    
    async saveVideo(video: {
      createReadStream: () => ReadStream;
      filename: string;
      mimetype: string;
    }): Promise<string> {
      if (!video || !['video/mp4'].includes(video.mimetype)) {
        throw new BadRequestException(
          'Invalid video file format. Only MP4 is allowed.',
        );
      }
    
      const { url, key } = await this.s3Service.getPresignedUrl(video.mimetype);
    
      const stream = video.createReadStream();
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk as Buffer));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    
      await fetch(url, {
        method: 'PUT',
        body: buffer,
        headers: { 'Content-Type': video.mimetype },
      });
    
      return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    }

    async createPost(data: CreatePostDto): Promise<Post> {
      return this.prisma.post.create({
        data: {
          text: data.text,
          video: data.video,
          userId: data.userId,
        },
        include: {
          user: true,
          likes: true,
          comments: true,
        },
      });
    }

      async getPostById(id: number): Promise<PostDetails> {
        try {
          const post = await this.prisma.post.findUnique({
            where: {id},
            include: {
              user:true,
              likes:true,
              comments:true
            }
          })

          const postIds = await this.prisma.post.findMany({
            where: {userId: post.userId},
            select: {id: true}
          })

          return {...post,otherPostIds: postIds.map((post) => post.id)}
          
        } catch (error) {
          throw new NotFoundException(error.message);
        }
      }

      async getPosts(skip:number,take:number):Promise<PostType[]> {
        return await this.prisma.post.findMany({
          skip,
          take,
          include: {user:true,likes:true,comments:true},
          orderBy: {createdAt: 'desc'}
        })
      }

      async getPostsByUserId(userId: number): Promise<PostType[]> {
        const posts = await this.prisma.post.findMany({
          where: { userId },
          include: {
            user: true,
            likes: true,
          },
        });
      
        return posts.map(post => ({
          ...post,
          likesCount: post.likes.length,
        }));
      }

      async deletePost(id: number): Promise<void> {
        const post = await this.getPostById(id);
        const key = post.video.split('/').pop();
        await this.s3Service.deleteFile(`videos/${key}`);
        await this.prisma.post.delete({ where: { id } });
      }

      async getLikedPostsByUserId(userId: number): Promise<PostType[]> {
        const likedPosts = await this.prisma.like.findMany({
          where: { userId },
          include: {
            post: {
              include: {
                user: true,
                likes: true,
              },
            },
          },
        });
      
        return likedPosts.map(like => ({
          ...like.post,
          likesCount: like.post.likes.length,
        }));
      }
}
