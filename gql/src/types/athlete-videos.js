import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList,
} from "graphql"

const VideoProviderType = new GraphQLEnumType({
  name: "VideoProvider",
  description: "Who is hosting/providing this video?",
  values: {
    YOUTUBE: {
      value: "youtube",
    },
    HUDL: {
      value: "hudl",
    },
    AMAZON: {
      value: "amazon",
    },
    VIMEO: {
      value: "vimeo",
    },
  },
})

const VideoTypeType = new GraphQLEnumType({
  name: "VideoType",
  description: "What type of video clip is this?",
  values: {
    HIGHLIGHT: {
      value: "Highlight",
    },
  },
})

const VideoTranscodingsType = new GraphQLObjectType({
  name: "VideoTranscodingElement",
  description: "Single video transcoding of a video",
  fields: () => ({
    url: {
      type: GraphQLString,
    },
    mimeType: {
      type: GraphQLString,
    },
  }),
})

// http://techslides.com/demos/sample-videos/small.webm
const VideoType = new GraphQLObjectType({
  name: "VideoElement",
  description: "An individual video element",
  fields: () => ({
    videoId: {
      type: GraphQLInt,
    },
    id: {
      type: GraphQLInt,
    },
    thumbnailUrl: {
      type: GraphQLString,
    },
    transcodings: {
      type: new GraphQLList(VideoTranscodingsType),
    },
    type: {
      type: VideoTypeType, // see above re: enum usage
    },
    title: {
      type: GraphQLString,
    },
    updatedAt: {
      type: GraphQLString,
    },
    createdAt: {
      type: GraphQLString,
    },
    videoNumber: {
      type: GraphQLInt,
    },
    embedCode: {
      type: GraphQLString,
    },
    sortOrder: {
      type: GraphQLInt,
    },
  }),
})

export default new GraphQLObjectType({
  name: "AthleteVideo",
  description: "Atlhete Video Element",
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    video: {
      type: VideoType,
    },
    provider: {
      type: VideoProviderType, // see above re: enum usage
    },
    createdAt: {
      type: GraphQLString,
    },
    sortOrder: {
      type: GraphQLInt,
    },
  }),
})
