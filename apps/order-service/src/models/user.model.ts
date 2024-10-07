import { Schema, model } from 'mongoose';

const userSchema = new Schema({
 userid: { type: String, required: true }, // same as docID in user service for a user
  name: { type: String, required: true },
  email: { type: String,  required: true, unique: true },
});

export const localUser = model('LocalUser', userSchema);
