import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.model';
import { Like } from '../like/like.model';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  text: string;

  @Prop()
  video?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Like' }] })
  likes: Like[];
}

export const PostSchema = SchemaFactory.createForClass(Post);