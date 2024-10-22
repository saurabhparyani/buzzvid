/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Comment } from './comment.type';
import { Request } from 'express';


@Resolver()
export class CommentResolver {
    constructor(private readonly commentService: CommentService) {}

    @Query((returns) => [Comment])
    async getCommentsByPostId(@Args('postId') postId: number) {
        return this.commentService.getCommentsByPostId(postId);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation((returns) => Comment)
    createComment(
        @Args('postId') postId: number,
        @Args('text') text: string,
        @Context() ctx: { req: Request },
      ) {
        return this.commentService.createComment({
          text: text,
          postId: postId,
          userId: ctx.req.user.sub,
        });
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Comment)
    deleteComment(@Args('id') id: number, @Context() ctx: { req: Request }) {
        return this.commentService.deleteComment(id, ctx.req.user.sub);
    }
}
