import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from "graphql"
import mongoose from "mongoose"
import athleteSchema from "../schema/athletes"
import athleteType from "./athlete"

export default new GraphQLObjectType({
  name: "Event",
  description: "Event",
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
      description: "Event name",
    },
    organizer: {
      type: GraphQLString,
      description: "Event Organizer",
    },
    start_date: {
      type: GraphQLString,
    },
    end_date: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    state: {
      type: GraphQLString,
    },
    website: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
    logo_image: {
      type: GraphQLString,
    },
    athletes: {
      type: new GraphQLList(athleteType),
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      description: "Athletes associated with this event",
      resolve: ({ id: eventId }, args) => {
        const Athlete = mongoose.model("Athletes", athleteSchema)

        const filters = Object.keys(args).reduce((aggregator, key) => {
          return key !== "page" && key !== "perPage"
            ? {
                ...aggregator,
                [key]: args[key],
              }
            : aggregator
        }, {})

        return Athlete.find({ events: eventId, ...filters }).lean()
      },
    },
  }),
})
