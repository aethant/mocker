import graphqlHTTP from "express-graphql"
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
} from "graphql"
import mongoose from "mongoose"

import eventSchema from "./schema/events"
import eventType from "./types/event"
import athletesType from "./types/athlete"
import eventMetaType from "./types/eventsMetaData"
import eventsResponseType from "./types/eventReponse"
import userSchema from "./schema/user"
import userType from "./types/user"
import athletesSchema from "./schema/athletes"

const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    athletes: {
      type: new GraphQLList(athletesType),
      args: {
        page: {
          type: GraphQLInt,
        },
        perPage: {
          type: GraphQLInt,
        },
      },
      resolve: (_, args) => {
        const Athlete = mongoose.model("Athletes", athletesSchema)
        const { page = 1, perPage } = args
        const pagination =
          page && perPage
            ? {
                skip: perPage * (page - 1),
                limit: perPage,
              }
            : {}

        const filters = Object.keys(args).reduce((aggregator, key) => {
          return key !== "page" && key !== "perPage"
            ? {
                ...aggregator,
                [key]: args[key],
              }
            : aggregator
        }, {})

        const athleteData = perPage
          ? Athlete.find(filters)
              .limit(pagination.limit)
              .skip(pagination.skip)
          : Athlete.find(filters)

        return athleteData
      },
    },
    events: {
      type: eventsResponseType,
      args: {
        id: {
          type: GraphQLInt,
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
        page: {
          type: GraphQLInt,
        },
        perPage: {
          type: GraphQLInt,
        },
      },
      resolve: (_, args) => {
        const Event = mongoose.model("Events", eventSchema)

        const { page = 1, perPage = 200 } = args
        const pagination =
          page && perPage
            ? {
                skip: perPage * (page - 1),
                limit: perPage,
              }
            : {}

        const filters = Object.keys(args).reduce((aggregator, key) => {
          return key !== "page" && key !== "perPage"
            ? {
                ...aggregator,
                [key]: args[key],
              }
            : aggregator
        }, {})

        const count = Event.find({})
          .count()
          .lean()

        const filtered = Event.find(filters)
          .count()
          .lean()

        const results = Event.find(filters)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .lean()

        return {
          _meta: {
            count,
            filtered,
          },
          results,
        }
      },
    },
    user: {
      type: userType,
      args: {
        login: {
          type: GraphQLString,
          description: "Login name",
        },
      },
      resolve: (_, { login }) => {
        const User = mongoose.model("User", userSchema)
        return User.findOne({ "name.login": login }).lean()
      },
    },
  },
})

const rootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  description: "Mutations for the queries",
  fields: () => ({
    eventTracking: {
      type: userType,
      description: "Toggle tracking state for a user to an event",
      args: {
        userId: {
          type: GraphQLString,
          description: "User ID",
        },
        eventId: {
          type: GraphQLInt,
          description: "Event ID",
        },
        trackingState: {
          type: GraphQLInt,
          description: "New event flagging stats",
        },
      },
      resolve: (_, { userId, eventId, trackingState }) => {
        const User = mongoose.model("User", userSchema)

        return User.findOne({ "name.login": userId }).then(user => {
          const { events: { tracking, attending } = {} } = user
          if (trackingState === 3) {
            // both track and attend
            user.set({ tracking: new Set([...tracking, eventId]) })
            user.set({ attending: new Set([...attending, eventId]) })
          } else if (trackingState === 2) {
            // tracking only
            user.set({
              "events.tracking": tracking.filter(id => id !== eventId),
            })
            user.set({ attending: new Set([...attending, eventId]) })
          } else if (trackingState === 1) {
            // remove from all trackers
            user.set({
              "events.tracking": tracking.filter(id => id !== eventId),
            })
            user.set({
              "events.attending": attending.filter(id => id !== eventId),
            })
          }

          //user.set({ "events.tracking": [...tracking, eventId] })
          return user
            .save()
            .then(resolved => resolved)
            .catch(err => console.error({ err }))
        })
      },
    },
  }),
})

const schema = new GraphQLSchema({ query: rootQuery, mutation: rootMutation })

module.exports = graphqlHTTP({
  schema,
  graphiql: true,
})
