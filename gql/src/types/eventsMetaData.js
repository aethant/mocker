import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from "graphql"

export default new GraphQLObjectType({
  name: "MetaDataEvents",
  description: "Metadata for Events data",
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
