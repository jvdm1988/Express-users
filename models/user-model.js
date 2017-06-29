const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const myUserSchema = new Schema(
  { // 1st arg -> structure object
    fullName: { type: String },
    username: { type: String },
    encryptedPassword: {type: String},
  },
  { // 2nd arg -> additional settings (optional)
    timestamps: true
  } // timestamps creates two additional field: "createdAt" & "updatedAt"
);

const UserModel = mongoose.model("User", myUserSchema);

module.exports = UserModel;
