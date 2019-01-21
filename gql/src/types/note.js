import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from "graphql"

export default new GraphQLObjectType({
  name: "Note",
  description: "Individual note entry",
  fields: () => ({
    timestamp: {
      type: GraphQLString,
    },
    body: {
      type: GraphQLString,
    },
  }),
})
