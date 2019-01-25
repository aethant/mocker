import mongoose from "mongoose"

const { Schema } = mongoose

const scheduleSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  teams: {
    type: [Number],
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  sport: {
    type: Number,
    required: true,
  },
  event: {
    type: Number,
    required: true,
  },
})

const Schedule = mongoose.model("Schedules", scheduleSchema)
export default Schedule
