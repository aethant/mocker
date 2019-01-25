import { GraphQLObjectType, GraphQLString } from "graphql"

export default new GraphQLObjectType({
  name: "SocialMedia",
  description: "Available social media fields",
  fields: () => ({
    instagram: {
      type: GraphQLString,
    },
    twitter: {
      type: GraphQLString,
    },
    facebook: {
      type: GraphQLString,
    },
  }),
})
