import { ObjectType, Field, Int } from '@nestjs/graphql';
import { LikeType } from 'src/like/like.type';
import { User } from 'src/user/user.model';

@ObjectType()
export class PostType {
  @Field(() => Int)
  id: number;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  video?: string;

  @Field(() => User)
  user: User;

  @Field(() => [LikeType], { nullable: true })
  likes?: LikeType[];
}

@ObjectType()
export class PostDetails extends PostType {
  @Field(() => [Number], { nullable: true })
  otherPostIds?: number[];
}