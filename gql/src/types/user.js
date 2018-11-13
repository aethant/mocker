import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
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

const userCoachPreferences = new GraphQLObjectType({
  name: "UserCoachPreferences",
  description: "Various settings/preferences set in Coach record",
  fields: {
    bypassAttendanceConfirmation: {
      type: GraphQLBoolean,
      description:
        "Does the coach want to avoid seeing the attendance confirm dialog on the event page?",
    },
  },
})

const userAthleteTaggingElementType = new GraphQLObjectType({
  name: "UserAthleteTaggingElement",
  descriptin: "User Athlete Tagging Element Info",
  fields: {
    id: {
      type: GraphQLInt,
      description: "Athlete ID",
    },
    tag: {
      type: GraphQLInt,
      description: "Tag color ID",
    },
  },
})

const userAthleteTaggingType = new GraphQLObjectType({
  name: "UserAthleteTagging",
  descriptin: "User Athlete Tagging Info",
  fields: {
    tagged: {
      type: new GraphQLList(userAthleteTaggingElementType),
      description: "Tag data",
    },
  },
})

export default new GraphQLObjectType({
  name: "User",
  description: "User",
  fields: {
    id: {
      type: GraphQLInt,
      description: "Unique User ID numeric",
    },
    name: {
      type: userNameType,
      description: "User ID",
    },
    email: {
      type: GraphQLString,
      description: "User email name",
    },
    sport: {
      type: GraphQLInt,
      description: "User sport",
    },
    school: {
      type: userSchoolType,
      description: "User school",
    },
    events: {
      type: userEventTaggingType,
      description: "User Event Tagging",
    },
    athletes: {
      type: userAthleteTaggingType,
      description: "User Athlete Tagging",
    },
    preferences: {
      type: userCoachPreferences,
      description: "Preference settings",
    },
  },
})
