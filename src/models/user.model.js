const { Schema, model } = require("mongoose");
const { genSalt, hash, compare } = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await genSalt(11);
    const hashedPassword = await hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.validUser = async function (password) {
  return await compare(password, this.password);
};

const User = model("User", userSchema);
module.exports = User;
