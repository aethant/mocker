import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from "graphql"
import athletesResponseType from "./athleteResponse"
import AthletesResolver from "../resolvers/athletes"

export default new GraphQLObjectType({
  name: "Event",
  description: "Event",
  fields: () => ({
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
      description: "Event website",
    },
    phone: {
      type: GraphQLString,
    },
    logo_image: {
      type: GraphQLString,
    },
    sport: {
      type: GraphQLInt,
    },
    tracking: {
      type: GraphQLBoolean,
      description: "is user tracking this event?",
    },
    attending: {
      type: GraphQLBoolean,
      description: "is user attending this event?",
    },
    athletes: {
      type: athletesResponseType,
      args: {
        id: {
          type: GraphQLInt,
        },
        page: {
          type: GraphQLInt,
        },
        perPage: {
          type: GraphQLInt,
        },
        searchText: {
          type: GraphQLString,
          description: "Text to search for inside althete names",
        },
        hasNotes: {
          type: GraphQLBoolean,
          description: "Has the user written a note about this athlete?",
        },
        tag: {
          type: new GraphQLList(GraphQLInt),
          description:
            "Has the user tagged this athlete with the given tag identifier(s)? (1-5)",
        },
      },
      description: "Athletes associated with this event",
      resolve: (queryContext, args, context) =>
        AthletesResolver(queryContext, args, { ...context, query: "event" }),
    },
  }),
})
