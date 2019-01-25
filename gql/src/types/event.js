import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from "graphql"
import athletesResponseType from "./athleteResponse"
import scheduleResponseType from "./scheduleResponse"
import teamResponseType from "./teamResponse"
import AthletesResolver from "../resolvers/athletes"
import ScheduleResolver from "../resolvers/schedule"
import TeamResolver from "../resolvers/teams"

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
    startDate: {
      type: GraphQLString,
    },
    endDate: {
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
    logoImage: {
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
    schedules: {
      type: scheduleResponseType,
      description: "Schedule of matches at event",
      args: {
        id: {
          type: GraphQLString,
        },
        event: {
          type: GraphQLInt,
        },
        page: {
          type: GraphQLInt,
        },
        perPage: {
          type: GraphQLInt,
        },
        tracked: {
          type: GraphQLBoolean,
          description: "Team is being tracked?",
        },
      },
      resolve: ScheduleResolver,
    },
    teams: {
      type: teamResponseType,
      description: "Teams attending an event",
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
        state: {
          type: new GraphQLList(GraphQLString),
        },
        tracked: {
          type: GraphQLBoolean,
          description: "Team is being tracked?",
        },
        sport: {
          type: GraphQLInt,
          description: "Sport associated with this team",
        },
        event: {
          type: GraphQLInt,
          description:
            "Event ID of an event that a team may be participating in",
        },
      },
      resolve: TeamResolver,
    },
  }),
})
