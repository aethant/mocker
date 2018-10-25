import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from "graphql"

const userType = new GraphQLObjectType({
  name: "User",
  description: "System user",
  fields: {
    first: {
      type: GraphQLString,
      description: "First name",
    },
    last: {
      type: GraphQLString,
      description: "Last name",
    },
  },
})

export default userType
