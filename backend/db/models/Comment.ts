import { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  userId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },  
  text: { type: String, required: true },
}, { timestamps: true }); 


const Comment = model<IComment>('Comment', CommentSchema);

export default Comment;
