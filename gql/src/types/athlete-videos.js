import { GraphQLObjectType, GraphQLString, GraphQLEnumType } from "graphql"

const VideoProviderType = new GraphQLEnumType({
  name: "VideoProvider",
  values: {
    YOUTUBE: {
      value: 0,
    },
    VIMEO: {
      value: 1,
    },
    HUDL: {
      value: 2,
    },
  },
})

export default new GraphQLObjectType({
  name: "AthleteVideo",
  description: "Atlhete Video Element",
  fields: () => ({
    label: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    provider: {
      type: VideoProviderType,
    },
    timestamp: {
      type: GraphQLString,
    },
  }),
})
