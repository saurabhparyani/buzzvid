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

  @Mutation(() => LikeType, { nullable: true })
  async unlikePost(
    @Args('postId') postId: number,
    @Context() ctx: { req: Request },
  ) {
    const result = await this.likeService.unlikePost(postId, ctx.req.user.sub);
    if (!result) {
      // You can choose to throw an error or return null
      // throw new NotFoundException('Like not found');
      return null;
    }
    return result;
  }
}
