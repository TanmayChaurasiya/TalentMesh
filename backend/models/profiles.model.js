const User = require("./user.model");

const mongoose = require("mongoose");

const EducationSchema = mongoose.Schema({
  school: {
    type: String,
    default: "",
  },
  degree: {
    type: String,
    default: "",
  },
  fieldOfStudy: {
    type: String,
    default: "",
  },
});

const WorkSchema = mongoose.Schema({
  company: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  years: {
    type: String,
    default: "",
  },
});

const ProfileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bio: {
    type: String,
    default: "",
  },
  currentPost: {
    type: String,
    default: "",
  },
  pastWork: {
    type: [WorkSchema],
    default: [],
  },
  education: {
    type: [EducationSchema],
    default: [],
  },
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
