import { GraphQLObjectType, GraphQLList } from "graphql"

import athleteMetaData from "./athleteMetaData"
import athletes from "./athlete"

export default new GraphQLObjectType({
  name: "AthletesMetaData",
  description: "Metadata for Athletes data",
  fields: () => ({
    _meta: {
      type: athleteMetaData,
      description: "Athletes Meta data",
    },
    results: {
      type: new GraphQLList(athletes),
      description: "Athletes data",
    },
  }),
})
