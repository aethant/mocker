import graphqlHTTP from "express-graphql"
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
} from "graphql"

import userType from "./types.js"

const users = [
  {
    first: "Alex",
    last: "Telischak",
  },
  {
    first: "John",
    last: "Doe",
  },
  {
    first: "Bugs",
    last: "Bunny",
  },
  {
    first: "Babs",
    last: "Bunny",
  },
  {
    first: "Joe",
    last: "Smith",
  },
]

const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: userType,
      args: {
        userid: {
          type: GraphQLInt,
          description: "record id",
        },
      },
      resolve: (_, { userid }) => {
        return users[userid] || null
      },
    },
    users: {
      type: new GraphQLList(userType),
      args: {
        first: {
          type: GraphQLString,
          description: "search by first name",
        },
        last: {
          type: GraphQLString,
          description: "search by last name",
        },
      },
      resolve: (_, { first, last }) => {
        if (!first && !last) return users

        return users.reduce((aggregator, user) => {
          if (first && user.first === first) {
            return [...aggregator, user]
          }

          if (last && user.last === last) {
            return [...aggregator, user]
          }

          return aggregator
        }, [])
      },
    },
  },
})

const schema = new GraphQLSchema({ query: rootQuery })

module.exports = graphqlHTTP({
  schema,
  graphiql: true,
})
