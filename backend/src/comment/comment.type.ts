import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Post } from '@prisma/client';
import { PostType } from 'src/post/post.type';
import { User } from 'src/user/user.model';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User;

  // Assuming Post model exists
  @Field(() => PostType)
  post: Post;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}