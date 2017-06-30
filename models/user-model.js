const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const myUserSchema = new Schema(
  { // 1st arg -> structure object
    fullname: { type: String },

    // SIGN UP/LOG IN FORM users - LOCAL STRATEGY ----------------------
    username: { type: String },
    encryptedPassword: {type: String},

    // GOOGLE users ----------------------------------------------------
    googleId: {type: String},

    // FACEBOOK users --------------------------------------------------
    facebookId: {type: String}
  },
  { // 2nd arg -> additional settings (optional)
    timestamps: true
  } // timestamps creates two additional field: "createdAt" & "updatedAt"
);

const UserModel = mongoose.model("User", myUserSchema);

module.exports = UserModel;
