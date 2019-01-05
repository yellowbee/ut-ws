/**
 * Created by bhuang on 6/19/18.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileIcon = new Schema({
  imgUrl: String,
  publicId: String
});
const basicInfo = new Schema({
    profileIcon: profileIcon,
    fullName: String,
    gmailId: String,
    jobTitle: String,
    personalUrl: String,
    skypeId: String
});

const contact = new Schema({
   phone: String
});

const selfIntro = new Schema({
   main: String
});

const workExp = new Schema({
   company: String,
    job: String,
    desc: String
});

const ProfileSchema = new Schema(
  {
      userName: String,
      basicInfo: basicInfo,
      contact: contact,
      selfIntro: selfIntro,
      workExp: workExp
  },
  { collection: "profiles" }
);

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
