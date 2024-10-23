/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { PostDetails,PostType } from './post.type';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Request } from 'express';
import { Prisma } from "@prisma/client";
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver()
export class PostResolver {

    constructor(private readonly postService: PostService) {}
    @UseGuards(GraphqlAuthGuard)
    @Mutation((returns) => PostType)
    async createPost(
        @Context() context: { req: Request },
        @Args({ name: 'video', type: () => GraphQLUpload }) video: any,
        @Args('text') text: string,
    ) {
        console.log('Received video:', video);
        console.log('Received text:', text);
        const userId = context.req.user.sub;
        console.log('userId:', userId);
        // Save the video and get its path
        const videoPath = await this.postService.saveVideo(video);

        // Create the post
        const postData = {
        text,
        video: videoPath,
        userId,
        };

        return await this.postService.createPost(postData);
    }

    @Query((returns) => PostDetails)
    async getPostById(@Args('id') id: number) {
        return await this.postService.getPostById(id);
    }

    @Query((returns) => [PostType])
    async getPosts(
        @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
        @Args('take', { type: () => Int, defaultValue: 1 }) take: number,
    ): Promise<PostType[]> {
        console.log('skip!', skip, 'take!', take);
        return await this.postService.getPosts(skip, take);
    }

    @Mutation((returns) => PostType)
    async deletePost(@Args('id') id: number) {
        return await this.postService.deletePost(id);
    }

    // get all the posts of a user
    @Query((returns) => [PostType])
    async getPostsByUserId(@Args('userId') userId: number) {
        return await this.postService.getPostsByUserId(userId);
    }

    @Query(() => [PostType])
    async getLikedPostsByUserId(@Args('userId') userId: number) {
        return this.postService.getLikedPostsByUserId(userId);
    }
}
