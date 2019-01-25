import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLEnumType,
} from "graphql"

import Event from "../schema/events"
import event from "./event"
import note from "./note"
import StatsType from "./athlete-stats"
import VideosType from "./athlete-videos"
import ContactType from "./contact"
import ParentType from "./parent"
import SocialMediaType from "./social-media"
import AcademicsType from "./academics"
import User from "../schema/user"
import Athlete from "../schema/athletes"
import AcadType from "./acad"

const AcademicScoreType = new GraphQLEnumType({
  name: "AcademicScore",
  values: {
    GPA: {
      value: "GPA",
    },
    COREGPA: {
      value: "Core GPA",
    },
    SAT: {
      value: "SAT",
    },
    ACT: {
      value: "ACT",
    },
  },
})

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
    firstName: {
      type: GraphQLString,
    },
    lastName: {
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
    teamName: {
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
    jersey: {
      type: GraphQLInt,
    },
    profilePicture: {
      type: GraphQLString,
    },
    profileUrl: {
      type: GraphQLString,
    },
    academics: {
      type: new GraphQLList(AcadType),
      args: {
        scores: {
          type: new GraphQLList(AcademicScoreType),
        },
      },
      description: "Academic scores",
      resolve: async (
        { id, eventid },
        { scores = [] },
        { user: { email } }
      ) => {
        const { gpa, coreGPA, sat, act } = await Athlete.findOne({ id })
        const response = [
          {
            label: "GPA",
            value: gpa,
            max: 4,
          },
          {
            label: "Core GPA",
            value: coreGPA,
          },
          {
            label: "SAT",
            value: sat,
          },
          {
            label: "ACT",
            value: act,
          },
        ]

        if (!scores.length) {
          return response
        }

        return response.filter(obj => scores.includes(obj.label))
      },
    },
    contact: {
      type: ContactType,
      description: "Contact methods",
      resolve: async ({ id, eventid }, args, { user: { email } }) => {
        const { email: athleteEmail, telephone } = await Athlete.findOne({ id })
        return {
          email: athleteEmail,
          telephone,
        }
      },
    },
    social: {
      type: SocialMediaType,
      description: "Social media",
      resolve: async ({ id, eventid }, args, { user: { email } }) => {
        const { twitter, instagram, facebook } = await Athlete.findOne({ id })
        return {
          twitter,
          instagram: twitter,
          facebook: twitter,
        }
      },
    },
    parents: {
      type: new GraphQLList(ParentType),
      description: "Athlete parent(s)",
      resolve: async ({ id, eventid }, args, { user: { email } }) => {
        return [
          {
            firstName: "John",
            lastName: "Smith",
            label: "Father",
            contact: {
              email: "jsmith001@example.org",
              telephone: "13125551212",
            },
          },
          {
            firstName: "Jane",
            lastName: "Smith",
            label: "Mother",
            contact: {
              email: "jsmith002@example.org",
              telephone: "13125552121",
            },
          },
        ]
      },
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
        ]
      },
    },
  }),
})
