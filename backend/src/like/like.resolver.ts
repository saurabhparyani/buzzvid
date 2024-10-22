import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/gql-auth.guard';
import { LikeService } from './like.service';
import { Request } from 'express';
import { LikeType } from './like.type';

@UseGuards(GraphqlAuthGuard)
@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => LikeType)
  async likePost(
    @Args('postId') postId: number,
    @Context() ctx: { req: Request },
  ) {
    return this.likeService.likePost({
      userId: ctx.req.user.sub,
      postId: postId,
    });
  }

  @Mutation(() => LikeType)
  async unlikePost(
    @Args('postId') postId: number,
    @Context() ctx: { req: Request },
  ) {
    return this.likeService.unlikePost(postId, ctx.req.user.sub);
  }
}