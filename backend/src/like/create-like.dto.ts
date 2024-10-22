import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLikeDto {
  @Field()
  postId: number;

  @Field()
  userId: number;
}