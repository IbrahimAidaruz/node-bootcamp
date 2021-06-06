const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const Schema = mongoose.Schema;

const accountsSchema = new Schema({
  username: {
    type: String,
    required: [true, "Fadlan geli username-kaaga"],
  },
  email: {
    type: String,
    required: [true, "Fadlan geli email-kaaga"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Fadlan geli Email saxan"],
  },
  password: {
    type: String,
    required: [true, "Fadlan geli password-kaaga"],
    minlength: [
      6,
      "Fadlan lama ogola password dhererkiisu ka yar yahay 6 xaraf",
    ],
  },
});

accountsSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//login static function

accountsSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect Password");
  }
  throw Error("incorrect Email");
};

module.exports = mongoose.model("account", accountsSchema);
