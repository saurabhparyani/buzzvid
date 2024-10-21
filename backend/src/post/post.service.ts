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

        // async createPost(data: CreatePostDto):Promise<Post> {
        //   return await this.prisma.post.create(data)
        // }

      // async getPostsById(id: string): Promise<PostDetails> {
      //   try {
      //     const post = await this.postModel.findById(id).populate('user').populate('likes').lean();
      //     if (!post) {
      //       throw new NotFoundException('Post not found');
      //     }
      //     const otherPosts = await this.postModel.find({ user: post.user.id, _id: { $ne: id } }).lean();
      //     const otherPostIds = otherPosts.map(post => post._id.toString());
      
      //     return {
      //       ...post,
      //       _id: post._id.toString(),
      //       otherPostIds,
      //       likes: post.likes.map(like => ({
      //         id: like._id?.toString(),
      //         userId: like.user?.id?.toString() || like.user?.id?.toString(),
      //         postId: like.post?.id?.toString() || like.post?.id?.toString()
      //       }))
      //     };
      //   } catch (error) {
      //     throw new NotFoundException('Post not found');
      //   }
      // }

}
