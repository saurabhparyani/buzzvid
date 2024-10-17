import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type UserDocument = User & Document;

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop({ required: true })
  fullname: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @HideField()
  @Prop({ required: function() { return !this.googleId; } })
  password?: string;

  @Field({ nullable: true })
  @Prop()
  bio?: string;

  @Field({ nullable: true })
  @Prop()
  image?: string;

  @Field(() => Date)
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Field({ nullable: true })
  @Prop()
  googleId?: string;

  @Field({ nullable: true })
  @Prop()
  googleImage?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);