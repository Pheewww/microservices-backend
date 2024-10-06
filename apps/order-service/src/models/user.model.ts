import { Schema, model } from 'mongoose';

const userSchema = new Schema({
//   userid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String,  required: true, unique: true },
});

export const localUser = model('LocalUser', userSchema);
