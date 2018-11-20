import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from "graphql"

import teamType from "./team"
import Teams from "../schema/teams"

export default new GraphQLObjectType({
  name: "Schedule",
  description: "Schedule",
  fields: () => ({
    id: {
      type: GraphQLString,
      description: "Schedule ID",
    },
    location: {
      type: GraphQLString,
      description: "Where is this scheduled event happening?",
    },
    sport: {
      type: GraphQLInt,
      description: "Sport for this match",
    },
    start_time: {
      type: GraphQLString,
      description: "When does the match start? (time/day)",
    },
    tracking: {
      type: GraphQLBoolean,
      description: "Is the user tracking this match?",
    },
    teams: {
      type: new GraphQLList(teamType),
      description: "Teams playing this game",
      resolve: async ({ teams }) => {
        return Teams.find({ id: { $in: teams } })
      },
    },
  }),
})
