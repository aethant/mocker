import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} from "graphql"

export default new GraphQLObjectType({
  name: "Academics",
  description: "Athlete academic scores",
  fields: () => ({
    gpa: {
      type: GraphQLFloat,
    },
    coreGPA: {
      type: GraphQLFloat,
    },
    sat: {
      type: GraphQLInt,
    },
    act: {
      type: GraphQLInt,
    },
  }),
})
