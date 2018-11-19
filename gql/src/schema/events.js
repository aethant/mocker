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
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
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
