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

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}
    
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

        const videoName = `${Date.now()}${extname(video.filename)}`;
        const videoPath = `/files/${videoName}`;

        const stream = video.createReadStream();
        const outputPath = `public${videoPath}`;
        const writeStream = createWriteStream(outputPath);
        stream.pipe(writeStream);

        await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
        });

        return videoPath;
      }

      async createPost(data: CreatePostDto):Promise<Post> {
          return await this.prisma.post.create({
            data: data
          })
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

      async getPostsByUserId(userId:number):Promise<PostType[]> {
        return await this.prisma.post.findMany({
          where: {userId},
          include: {user:true},
        })
      }

      async deletePost(id: number): Promise<void> {
        const post = await this.getPostById(id);
        try {
          const fs = await import('fs');
          fs.unlinkSync(`public${post.video}`);
        } catch (err) {
          throw new BadRequestException(err.message);
        }
    
        await this.prisma.post.delete({ where: { id } });
      }
}
