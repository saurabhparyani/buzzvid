import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  fullname: string;
  bio?: string;
  image?: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
}, { timestamps: true });

UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const userId = this._id;
  
    // Delete all posts by this user
    await model('Post').deleteMany({ userId });
  
    // Delete all comments by this user
    await model('Comment').deleteMany({ userId });
  
    // Delete all likes by this user
    await model('Like').deleteMany({ userId });
  
    next();
  });
  

const User = model<IUser>('User', UserSchema);

export default User;
