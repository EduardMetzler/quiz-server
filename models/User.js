import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";



export const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
  },

  email: {
    type: String,
    required: true,
    uniqe: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

const saltRound = await bcrypt.genSalt(10);

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltRound);
  next();
});

UserSchema.methods.comparePassword = async (pass, userPass) => {
  return await bcrypt.compare(pass, userPass); 
};


UserSchema.methods.deleteField = function (field) {
  delete this[field];
  return this;
};

const User = model("User", UserSchema);

export default User;
