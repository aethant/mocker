import mongoose from "mongoose"

const { Schema } = mongoose

const userSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
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
  sport: {
    type: Number,
    required: true,
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
  athletes: {
    tagged: {
      type: Array,
      default: [],
    },
    notes: {
      type: Object,
      default: {},
    },
  },
  schedule: {
    tracking: {
      type: Array,
      default: ["KTG_T2oEBjQ"],
    },
  },
  preferences: {
    bypassAttendanceConfirmation: {
      type: Boolean,
      default: false,
    },
  },
})

// retrieve list of athletes tagged by user with a given tag or tags
userSchema.statics.taggedAs = async function taggedAs(id, tag) {
  return await this.findOne({
    "name.login": id,
  }).then(user => {
    const tags = user.athletes.tagged.filter(el => tag.includes(el.tag))
    return tags.map(tag => tag.id)
  })
}

// retrieve athlete ids of athletes user has written notes on
userSchema.statics.hasNotes = async function hasNotes(id, athleteId) {
  return await this.findOne({
    "name.login": id,
  }).then(user => {
    const { athletes: { notes = {} } = {} } = user

    if (athleteId) {
      // if a specific athlete id is provided, check if the user wrote notes about that specific athlete
      return notes[athleteId] && Boolean(Object.keys(notes[athleteId]).length)
    }

    // otherwise, check all athletes in the notes object
    const athleteIds = Object.keys(notes)
    const athletesIdsWithContent = athleteIds.filter(key =>
      Boolean(Object.keys(notes[key]).length)
    )

    return athletesIdsWithContent.map(v => parseInt(v, 10)) || []
  })
}

userSchema.statics.bySport = async function bySport() {
  const data = await this.find()
  return data.reduce(
    (aggregate, user) => ({
      ...aggregate,
      [user.sport]: [...(aggregate[user.sport] || []), user.id],
    }),
    {}
  )
}

const User = mongoose.model("User", userSchema)
export default User
