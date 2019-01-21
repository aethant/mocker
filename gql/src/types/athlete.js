import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
} from "graphql"

import Event from "../schema/events"
import event from "./event"
import note from "./note"
import StatsType from "./athlete-stats"
import VideosType from "./athlete-videos"
import User from "../schema/user"

export default new GraphQLObjectType({
  name: "Athlete",
  description: "Athlete",
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    fullName: {
      type: GraphQLString,
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
      resolve: async ({ id }, args, { user: { email } }) => {
        const userData = await User.findOne({
          email,
        }).lean()

        const { tag = 0 } = userData.athletes.tagged.find(v => v.id === id) || 0

        return tag
      },
    },
    notes: {
      type: GraphQLString,
      description: "User notes on this athlete",
      resolve: async ({ id }, args, { user: { email } }) => {
        const idAsStr = id.toString()
        const userData = await User.findOne({
          email,
        }).lean()

        return userData.athletes.notes[idAsStr] || ""
      },
    },
    stats: {
      type: new GraphQLList(StatsType),
      description: "Athlete stats to display",
      resolve: async ({ id }, args, { user: { email } }) => {
        const fakeStat = [
          {
            label: "Points/Game",
            value: "21",
            isCurrent: true,
            verifier: {
              name: "Bob Smith",
              timestamp: "1548085475",
            },
          },
          {
            label: "Free Throw %",
            value: "80",
            isCurrent: true,
          },
        ]
        return fakeStat
      },
    },
    videos: {
      type: new GraphQLList(VideosType),
      description: "Videos/highlights to display",
      resolve: async ({ id }, args, { user: { email } }) => {
        return [
          {
            label: "2018 Highlights",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            provider: 0,
            timestamp: "1548085475",
          },
          {
            label: "2018 Highlights",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            provider: 0,
            timestamp: "1548085475",
          },
        ]
      },
    },
  }),
})
