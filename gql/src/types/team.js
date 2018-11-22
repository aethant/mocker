import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from "graphql"
import Athlete from "../schema/athletes"
import Event from "../schema/events"
import athletesResponseType from "./athleteResponse"
import AthletesResolver from "../resolvers/athletes"

export default new GraphQLObjectType({
  name: "Team",
  description: "Team",
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
      description: "Event name",
    },
    city: {
      type: GraphQLString,
    },
    state: {
      type: GraphQLString,
    },
    logo: {
      type: GraphQLString,
    },
    sport: {
      type: GraphQLInt,
      description: "Sport associated with this team",
    },
    events: {
      type: new GraphQLList(GraphQLInt),
      description: "Event ID of an event that a team may be participating in",
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
        AthletesResolver(queryContext, args, { ...context, query: "team" }),
    },
    events: {
      type: new GraphQLList(GraphQLInt),
    },
  }),
})
