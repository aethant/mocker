import mongoose from "mongoose"

const { Schema } = mongoose

const teamSchema = new Schema({
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
  sport: {
    type: Number,
    required: true,
  },
  logo: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  events: {
    type: [Number],
  },
  athletes: {
    type: [Number],
  },
})

teamSchema.statics.bySport = async function bySport() {
  const data = await this.find()
  return data.reduce(
    (aggregate, team) => ({
      ...aggregate,
      [team.sport]: [...(aggregate[team.sport] || []), team.id],
    }),
    {}
  )
}

const Team = mongoose.model("Teams", teamSchema)
export default Team
