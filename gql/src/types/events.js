import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql"

export default new GraphQLObjectType({
  name: "Event",
  description: "Event",
  fields: {
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
    logo: {
      type: GraphQLString,
    },
  },
})
