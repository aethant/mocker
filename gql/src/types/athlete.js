import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
} from "graphql"
import mongoose from "mongoose"
import eventsSchema from "../schema/events"
import event from "./event"
import userSchema from "../schema/user"
import userType from "./user"

export default new GraphQLObjectType({
  name: "Athlete",
  description: "Athlete",
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    first_name: {
      type: GraphQLString,
    },
    last_name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    gender: {
      type: GraphQLString,
    },
    position: {
      type: GraphQLString,
    },
    state: {
      type: GraphQLString,
    },
    team_name: {
      type: GraphQLString,
    },
    height: {
      type: GraphQLString,
    },
    weight: {
      type: GraphQLString,
    },
    sport: {
      type: GraphQLInt,
    },
    dob: {
      type: GraphQLString,
    },
    twitter: {
      type: GraphQLString,
    },
    jersey: {
      type: GraphQLInt,
    },
    events: {
      type: new GraphQLList(event),
      description: "Events associated with this athlete",
      resolve: ({ events }, args) => {
        const Event = mongoose.model("Events", eventsSchema)
        const filters = Object.keys(args).reduce((aggregator, key) => {
          return key !== "page" && key !== "perPage"
            ? {
                ...aggregator,
                [key]: args[key],
              }
            : aggregator
        }, {})

        return Event.find({ id: { $in: events }, ...filters }).lean()
      },
    },
    gpa: {
      type: GraphQLFloat,
    },
    telephone: {
      type: GraphQLString,
    },
    profile_picture: {
      type: GraphQLString,
    },
    tag: {
      type: GraphQLInt,
      description: "User assigned tag value",
      resolve: async ({ id }, args, { user: { username } }) => {
        const User = mongoose.model("User", userSchema)

        const userData = await User.findOne({
          "name.login": username,
        }).lean()

        const { tag = 0 } = userData.athletes.tagged.find(v => v.id === id) || 0

        return tag
      },
    },
  }),
})
