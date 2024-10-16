import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
  userId: Schema.Types.ObjectId;
  text: string;
  video?: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
}

const PostSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  video: { type: String },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],  
  likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
}, { timestamps: true });

PostSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const postId = this._id;
  
    // Delete all comments by this post
    await model('Comment').deleteMany({ postId });
  
    // Delete all likes by this post
    await model('Like').deleteMany({ postId });
  
    next();
  });

const Post = model<IPost>('Post', PostSchema);

export default Post;
