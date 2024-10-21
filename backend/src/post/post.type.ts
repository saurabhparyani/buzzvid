import { ObjectType, Field, ID } from '@nestjs/graphql';
import { LikeType } from 'src/like/like.type';
import { User } from 'src/user/user.model';

@ObjectType()
export class PostType {
  @Field(() => ID)
  _id: string;

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
  @Field(() => [String], { nullable: true })
  otherPostIds?: string[];
}