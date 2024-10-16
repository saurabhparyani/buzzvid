import { Schema, model, Document } from 'mongoose';

export interface ILike extends Document {
  userId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LikeSchema = new Schema<ILike>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = model<ILike>('Like', LikeSchema);

export default Like;
