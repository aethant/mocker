import { GraphQLObjectType, GraphQLList } from "graphql"

import schedulesMetaData from "./schedulesMetaData"
import schedule from "./schedule"

export default new GraphQLObjectType({
  name: "SchedulesMetaData",
  description: "Metadata for Schedules data",
  fields: () => ({
    _meta: {
      type: schedulesMetaData,
      description: "Schedules Meta data",
    },
    results: {
      type: new GraphQLList(schedule),
      description: "Schedules data",
    },
  }),
})
