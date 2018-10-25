import { Schema } from "mongoose"

export default new Schema({
  id: {
    type: Number,
    required: true,
    index: {
      unique: true,
    },
  },
  name: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  end_date: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  logo_image: {
    type: String,
    required: true,
  },
})
