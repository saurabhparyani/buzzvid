import { Field, ObjectType } from "@nestjs/graphql";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@ObjectType()
@Schema()
export class User {
  @Field()
  _id?: string;

  @Field()
  fullname: string;

  @Field()
  email?: string;

  @Field()
  password: string;

  @Field({nullable: true})
  bio?: string;

  @Field({nullable: true})
  image: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
