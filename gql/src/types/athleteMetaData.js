import { GraphQLObjectType, GraphQLInt } from "graphql"

export default new GraphQLObjectType({
  name: "MetaDataAthletes",
  description: "Metadata for Athletes data",
  fields: {
    count: {
      type: GraphQLInt,
      description: "Total records count",
    },
    countAtEvent: {
      type: GraphQLInt,
      description: "Total records at event count",
    },
    filtered: {
      type: GraphQLInt,
      description: "Total records count with filters applied",
    },
  },
})
