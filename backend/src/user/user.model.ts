import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class User {
  @Field()
  id?:number;

  @Field()
  fullname: string;

  @Field()
  email?: string;

  @Field()
  password?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  googleId?: string;

  @Field({ nullable: true })
  googleImage?: string;
}