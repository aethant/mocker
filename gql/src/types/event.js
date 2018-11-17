import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from "graphql"
import Athlete from "../schema/athletes"
import athletesResponseType from "./athleteResponse"
import User from "../schema/user"

const searchTextFilter = val =>
  val.length === 0
    ? null
    : {
        $or: [
          { first_name: { $regex: val, $options: "i" } },
          { last_name: { $regex: val, $options: "i" } },
        ],
      }

export default new GraphQLObjectType({
  name: "Event",
  description: "Event",
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
      description: "Event name",
    },
    organizer: {
      type: GraphQLString,
      description: "Event Organizer",
    },
    start_date: {
      type: GraphQLString,
    },
    end_date: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    state: {
      type: GraphQLString,
    },
    website: {
      type: GraphQLString,
      description: "Event website",
    },
    phone: {
      type: GraphQLString,
    },
    logo_image: {
      type: GraphQLString,
    },
    sport: {
      type: GraphQLInt,
    },
    tracking: {
      type: GraphQLBoolean,
      description: "is user tracking this event?",
    },
    attending: {
      type: GraphQLBoolean,
      description: "is user attending this event?",
    },
    athletes: {
      type: athletesResponseType, // new GraphQLList(athleteType),
      args: {
        id: {
          type: GraphQLInt,
        },
        page: {
          type: GraphQLInt,
        },
        perPage: {
          type: GraphQLInt,
        },
        searchText: {
          type: GraphQLString,
          description: "Text to search for inside althete names",
        },
        hasNotes: {
          type: GraphQLBoolean,
          description: "Has the user written a note about this athlete?",
        },
        tag: {
          type: new GraphQLList(GraphQLInt),
          description:
            "Has the user tagged this athlete with the given tag identifier(s)? (1-5)",
        },
      },
      description: "Athletes associated with this event",
      resolve: async ({ id: eventId }, args, { user }) => {
        const { page = 1, perPage, tag, hasNotes } = args
        const pagination =
          page && perPage
            ? {
                skip: perPage * (page - 1),
                limit: perPage,
              }
            : {}

        const submittedNotesAthleteIds = hasNotes
          ? await User.hasNotes(user.username)
          : []

        const taggedElements =
          tag && tag.length ? await User.taggedAs(user.username, tag) : []

        const specificIdsToEvaluate = [
          ...submittedNotesAthleteIds,
          ...taggedElements,
        ]

        const filterBase =
          (tag && tag.length) || hasNotes
            ? {
                events: eventId,
                id: { $in: specificIdsToEvaluate },
              }
            : {
                events: eventId,
              }

        const filters = Object.keys(args).reduce((aggregator, key) => {
          if (key === "searchText") {
            return {
              ...aggregator,
              ...searchTextFilter(args[key]),
            }
          }

          return key !== "page" &&
            key !== "perPage" &&
            key !== "tag" &&
            key !== "hasNotes"
            ? {
                ...aggregator,
                [key]: args[key],
              }
            : aggregator
        }, filterBase)

        const count = Athlete.find()
          .count()
          .lean()

        const countAtEvent = Athlete.find({ events: eventId })
          .count()
          .lean()

        const filtered = Athlete.find({ ...filters })
          .count()
          .lean()

        const results = perPage
          ? Athlete.find({ ...filters })
              .limit(pagination.limit)
              .skip(pagination.skip)
          : Athlete.find({ ...filters })

        return {
          _meta: {
            count,
            countAtEvent,
            filtered,
          },
          results,
        }
      },
    },
  }),
})
