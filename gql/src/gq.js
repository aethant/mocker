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
import eventType from "./types/events"
import eventMetaType from "./types/eventsMetaData"
import eventsResponseType from "./types/eventReponse"
import userSchema from "./schema/user"
import userType from "./types/user"

const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // _eventsMeta: {
    //   type: eventMetaType,
    //   resolve: () => {
    //     const Event = mongoose.model("Events", eventSchema)
    //     const count = Event.find({}).count()
    //     return {
    //       count,
    //     }
    //   },
    // },
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
        const { page = 1, perPage = 100 } = args
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

        const data = Event.find(filters)
          .limit(pagination.limit)
          .skip(pagination.skip)

        return {
          _meta: {
            count,
            filtered,
          },
          data,
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

const schema = new GraphQLSchema({ query: rootQuery })

module.exports = graphqlHTTP({
  schema,
  graphiql: true,
})
