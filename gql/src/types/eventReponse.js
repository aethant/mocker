import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
} from "graphql"

import eventsMetaData from "./eventsMetaData"
import events from "./event"

export default new GraphQLObjectType({
  name: "EventsMetaData",
  description: "Metadata for Events data",
  fields: () => ({
    _meta: {
      type: eventsMetaData,
      description: "Events Meta data",
    },
    results: {
      type: new GraphQLList(events),
      description: "Events data",
    },
  }),
})
