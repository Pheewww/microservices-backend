 
import { Schema, model} from 'mongoose';
import { Role } from '@repo/shared/types';  

// export interface IUser extends Document {
//     name: string;
//     email: string;
//     password: string;
//     role: Role,
//     comparePassword(password: string): Promise<boolean>;  
// }

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, enum: Role, default: Role.USER},
});

 
// userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
//     return await bcrypt.compare(password, this.password);
// };

const User = model('User', userSchema);

export default User;
