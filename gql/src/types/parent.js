import { GraphQLObjectType, GraphQLString } from "graphql"

import ContactType from "./contact"

export default new GraphQLObjectType({
  name: "Parent",
  description: "Athlete parent",
  fields: () => ({
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    label: {
      type: GraphQLString,
      description:
        "Description of relationship to student (Mother, father, guardian)",
    },
    contact: {
      type: ContactType,
    },
  }),
})
