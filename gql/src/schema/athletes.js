import mongoose from "mongoose"

const { Schema } = mongoose

const AthleteSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
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
    teamName: {
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
    profilePicture: {
      type: String,
    },
    jersey: {
      type: Number,
    },
  },
  {
    toObject: { getters: true, setters: true, virtuals: true },
    toJSON: { getters: true, setters: true, virtuals: true },
  }
)

AthleteSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`
})

AthleteSchema.statics.bySport = async function bySport() {
  const data = await this.find()
  return data.reduce(
    (aggregate, athlete) => ({
      ...aggregate,
      [athlete.sport]: [...(aggregate[athlete.sport] || []), athlete.id],
    }),
    {}
  )
}

const Athlete = mongoose.model("Athletes", AthleteSchema)
export default Athlete
