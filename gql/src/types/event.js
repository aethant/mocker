import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from "graphql"
import mongoose from "mongoose"
import athleteSchema from "../schema/athletes"
import athleteType from "./athlete"
import athletesResponseType from "./athleteResponse"

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
      description: "Event website",
    },
    phone: {
      type: GraphQLString,
    },
    logo_image: {
      type: GraphQLString,
    },
    sport: {
      type: GraphQLInt,
    },
    tracking: {
      type: GraphQLBoolean,
      description: "is user tracking this event?",
    },
    attending: {
      type: GraphQLBoolean,
      description: "is user attending this event?",
    },
    athletes: {
      type: athletesResponseType, // new GraphQLList(athleteType),
      args: {
        id: {
          type: GraphQLInt,
        },
        page: {
          type: GraphQLInt,
        },
        perPage: {
          type: GraphQLInt,
        },
      },
      description: "Athletes associated with this event",
      resolve: ({ id: eventId }, args) => {
        const Athlete = mongoose.model("Athletes", athleteSchema)
        const { page = 1, perPage } = args
        const pagination =
          page && perPage
            ? {
                skip: perPage * (page - 1),
                limit: perPage,
              }
            : {}

        const filters = Object.keys(args).reduce(
          (aggregator, key) => {
            return key !== "page" && key !== "perPage"
              ? {
                  ...aggregator,
                  [key]: args[key],
                }
              : aggregator
          },
          {
            events: eventId,
          }
        )

        const count = Athlete.find()
          .count()
          .lean()
        const countAtEvent = Athlete.find({ events: eventId })
          .count()
          .lean()
        const filtered = Athlete.find({ ...filters })
          .count()
          .lean()

        const results = perPage
          ? Athlete.find({ ...filters })
              .limit(pagination.limit)
              .skip(pagination.skip)
          : Athlete.find({ ...filters })

        return {
          _meta: {
            count,
            countAtEvent,
            filtered,
          },
          results,
        }
      },
    },
  }),
})
