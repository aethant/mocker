import { Schema } from "mongoose"

export default new Schema({
  name: {
    login: {
      type: String,
      required: true,
    },
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
  },
  school: {
    name: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  events: {
    tracking: {
      type: Array,
      default: [],
    },
    attending: {
      type: Array,
      default: [],
    },
  },
})
