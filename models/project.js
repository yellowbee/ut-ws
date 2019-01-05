/**
 * Created by bhuang on 5/12/18.
 */
const mongoose = require("mongoose");
const Profile = require("./profile");
const Schema = mongoose.Schema;

const descBlock = new Schema({
  type: String,
  imgUrl: String,
  value: String,
  thumbnailUrl: String
});
const comment = new Schema({ author: String, body: String });

const ProjectSchema = new Schema(
  {
    description: [descBlock],
    categories: String,
    title: String,
    comments: [comment],
      pImage: String,
    postedBy: { type: Schema.Types.ObjectId, ref: "Profile" }
  },
  { collection: "projects" }
);

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
