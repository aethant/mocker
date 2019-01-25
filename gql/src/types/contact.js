import { GraphQLObjectType, GraphQLString } from "graphql"

export default new GraphQLObjectType({
  name: "Contacts",
  description: "Available contact methods",
  fields: () => ({
    email: {
      type: GraphQLString,
    },
    telephone: {
      type: GraphQLString,
    },
  }),
})
