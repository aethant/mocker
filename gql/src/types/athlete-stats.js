import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLBoolean,
} from "graphql"

const VerifierType = new GraphQLObjectType({
  name: "AthleteStatVerifier",
  description: "Describes who verified a given athlete stat",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    timestamp: {
      type: GraphQLString,
    },
  }),
})

export default new GraphQLObjectType({
  name: "AthleteStat",
  description: "Atlhete Stat Element",
  fields: () => ({
    label: {
      type: GraphQLString,
    },
    value: {
      type: GraphQLString,
    },
    isCurrent: {
      type: GraphQLBoolean,
    },
    verifier: {
      type: VerifierType,
    },
  }),
})
