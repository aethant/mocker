import { GraphQLObjectType, GraphQLList } from "graphql"

import eventsMetaData from "./eventsMetaData"
import events from "./events"

export default new GraphQLObjectType({
  name: "EventsMetaData",
  description: "Metadata for Events data",
  fields: {
    _meta: {
      type: eventsMetaData,
      description: "Events Meta data",
    },
    data: {
      type: new GraphQLList(events),
      description: "Events data",
    },
  },
})
