import { Schema } from "mongoose"

export default new Schema({
  id: {
    type: Number,
    required: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  position: {
    type: String,
  },
  state: {
    type: String,
  },
  team_name: {
    type: String,
  },
  height: {
    type: String,
  },
  weight: {
    type: String,
  },
  sport: {
    type: Number,
  },
  dob: {
    type: Date,
  },
  twitter: {
    type: String,
  },
  events: {
    type: [Number],
  },
  gpa: {
    type: Number,
  },
  telephone: {
    type: String,
  },
  profile_picture: {
    type: String,
  },
})
