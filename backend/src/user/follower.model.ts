import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Follower {
  @Field(() => Number)
  id: number;

  @Field()
  fullname: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  googleImage?: string;
}