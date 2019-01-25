import mongoose from "mongoose"

const { Schema } = mongoose

const eventSchema = new Schema({
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
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  website: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  logoImage: {
    type: String,
    required: true,
  },
  sport: {
    type: Number,
  },
})

eventSchema.statics.bySport = async function bySport() {
  const data = await this.find()
  return data.reduce(
    (aggregate, event) => ({
      ...aggregate,
      [event.sport]: [...(aggregate[event.sport] || []), event.id],
    }),
    {}
  )
}

const Event = mongoose.model("Events", eventSchema)
export default Event
