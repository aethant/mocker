import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from "graphql"

const userNameType = new GraphQLObjectType({
  name: "UserName",
  description: "User ID Info",
  fields: {
    login: {
      type: GraphQLString,
      description: "User login name",
    },
    first: {
      type: GraphQLString,
      description: "User first name",
    },
    last: {
      type: GraphQLString,
      description: "User last name",
    },
  },
})

const userSchoolType = new GraphQLObjectType({
  name: "UserSchool",
  description: "User School Info",
  fields: {
    name: {
      type: GraphQLString,
      description: "User school name",
    },
    title: {
      type: GraphQLString,
      description: "User title at school",
    },
  },
})

const userEventTaggingType = new GraphQLObjectType({
  name: "UserEventTagging",
  description: "User Event Tagging Info",
  fields: {
    tracking: {
      type: new GraphQLList(GraphQLInt),
      description: "Events user is tracking",
    },
    attending: {
      type: new GraphQLList(GraphQLInt),
      description: "Events user is attending",
    },
  },
})

export default new GraphQLObjectType({
  name: "User",
  description: "User",
  fields: {
    name: {
      type: userNameType,
      description: "User ID",
    },
    email: {
      type: GraphQLString,
      description: "User email name",
    },
    school: {
      type: userSchoolType,
      description: "User school",
    },
    events: {
      type: userEventTaggingType,
      description: "User Event Tagging",
    },
  },
})
