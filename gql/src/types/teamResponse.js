import { GraphQLObjectType, GraphQLList } from "graphql"

import teamMetaData from "./teamMetaData"
import team from "./team"

export default new GraphQLObjectType({
  name: "TeamMetaData",
  description: "Metadata for Team data",
  fields: () => ({
    _meta: {
      type: teamMetaData,
      description: "Teams Meta data",
    },
    results: {
      type: new GraphQLList(team),
      description: "Teams data",
    },
  }),
})
