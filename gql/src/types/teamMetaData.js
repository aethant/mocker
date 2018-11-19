import { GraphQLObjectType, GraphQLInt } from "graphql"

export default new GraphQLObjectType({
  name: "MetaDataTeams",
  description: "Metadata for Teams data",
  fields: {
    count: {
      type: GraphQLInt,
      description: "Total records count",
    },
    filtered: {
      type: GraphQLInt,
      description: "Total records count with filters applied",
    },
  },
})
