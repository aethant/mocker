import { GraphQLObjectType, GraphQLString, GraphQLFloat } from "graphql"

export default new GraphQLObjectType({
  name: "Academic",
  description: "Athlete academic score",
  fields: () => ({
    value: {
      type: GraphQLFloat,
      description: "Value of this score",
    },
    label: {
      type: GraphQLString,
      description: "Description of the score",
    },
    max: {
      type: GraphQLFloat,
      description: "Max range for the given score",
    },
  }),
})
