import graphqlHTTP from "express-graphql"
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList,
} from "graphql"
import uniq from "lodash/uniq"

import athletesType from "./types/athlete"
import eventType from "./types/event"
import eventsResponseType from "./types/eventReponse"

import Event from "./schema/events"
import User from "./schema/user"
import Athlete from "./schema/athletes"
import userType from "./types/user"

const dateFilters = (start, end) => ({
  start_date: start
    ? {
        [`$gte`]: new Date(parseInt(start, 10) * 1000),
      }
    : null,
  end_date: end ? { [`$lt`]: new Date(parseInt(end, 10) * 1000) } : null,
})

const trackedFilters = ids => ({
  id: { $in: ids },
})

const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    athletes: {
      type: new GraphQLList(athletesType),
      args: {
        page: {
          type: GraphQLInt,
        },
        perPage: {
          type: GraphQLInt,
        },
      },
      resolve: async (_, args, { user }) => {
        const { page = 1, perPage } = args
        const pagination =
          page && perPage
            ? {
                skip: perPage * (page - 1),
                limit: perPage,
              }
            : {}

        const filters = Object.keys(args).reduce((aggregator, key) => {
          return key !== "page" && key !== "perPage"
            ? {
                ...aggregator,
                [key]: args[key],
              }
            : aggregator
        }, {})

        const count = await Athlete.find({})
          .count()
          .lean()

        const filtered = await Athlete.find(filters)
          .count()
          .lean()

        const results = perPage
          ? Athlete.find(filters)
              .limit(pagination.limit)
              .skip(pagination.skip)
          : Athlete.find(filters)

        return {
          _meta: {
            count,
            filtered,
          },
          results,
        }
      },
    },
    event: {
      type: eventType,
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: async (_, args, { user }) => {
        const { id } = args
        const userData = await User.findOne({
          "name.login": user.username,
        }).lean()

        const eventData = await Event.findOne({ id }).lean()

        return {
          ...eventData,
          tracking: userData.events.tracking.includes(id),
          attending: userData.events.attending.includes(id),
        }
      },
    },
    events: {
      type: eventsResponseType,
      args: {
        id: {
          type: GraphQLInt,
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
          type: new GraphQLList(GraphQLString),
        },
        page: {
          type: GraphQLInt,
        },
        perPage: {
          type: GraphQLInt,
        },
        tracked: {
          type: GraphQLBoolean,
          description: "Event is being tracked?",
        },
        organizer: {
          type: GraphQLString,
          description: "Event Organizer",
        },
      },
      resolve: async (_, args, { user }) => {
        const userData = await User.findOne({
          "name.login": user.username,
        }).lean()

        const { page = 1, perPage = 200, start_date, end_date } = args
        const pagination =
          page && perPage
            ? {
                skip: perPage * (page - 1),
                limit: perPage,
              }
            : {}

        const prefilters = Object.keys(args).reduce(
          (aggregator, key) => {
            return key !== "page" &&
              key !== "perPage" &&
              key !== "start_date" &&
              key !== "end_date" &&
              key !== "tracked"
              ? {
                  ...aggregator,
                  [key]: args[key],
                }
              : aggregator
          },
          {
            ...(args.tracked
              ? trackedFilters(
                  uniq([
                    ...userData.events.tracking,
                    ...userData.events.attending,
                  ])
                )
              : {}),
            ...(args.id || args.tracked || args.organizer
              ? {}
              : dateFilters(start_date, end_date)),
          }
        )

        const filters = Object.keys(prefilters).reduce(
          (aggregator, v) => {
            if (v === "state" && prefilters[v].length === 0) {
              return aggregator
            }
            if (prefilters[v]) {
              return {
                ...aggregator,
                [v]: prefilters[v],
              }
            }
            return aggregator
          },
          {
            sport: userData.sport,
          }
        )

        const count = await Event.find({})
          .count()
          .lean()

        const filtered = await Event.find(filters)
          .count()
          .lean()

        const data = await Event.find(filters)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .lean()
          .sort("start_date")

        let results = data.reduce(
          (aggregator, result) => [
            ...aggregator,
            {
              ...result,
              tracking: userData.events.tracking.includes(result.id),
              attending: userData.events.attending.includes(result.id),
            },
          ],
          []
        )

        return {
          _meta: {
            count,
            filtered,
          },
          results,
        }
      },
    },
    user: {
      type: userType,
      resolve: (_, args, { user }) => {
        return User.findOne({ "name.login": user.username }).lean()
      },
    },
  },
})

const rootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  description: "Mutations for the queries",
  fields: () => ({
    athlete: {
      type: athletesType,
      description: "Modify athlete",
      args: {
        id: {
          type: GraphQLInt,
          description: "Athlete unique identifer",
        },
        tag: {
          type: GraphQLInt,
          desription: "Tag color set by user on this athlete",
        },
      },
      resolve: async (_, { id, tag }, { user }) => {
        return User.findOne({
          "name.login": user.username,
        }).then(async user => {
          const { athletes: { tagged = [] } = {} } = user

          const tags = tagged.filter(v => v.id !== id)
          const updatedTag =
            tag > 0
              ? {
                  id,
                  tag,
                }
              : null

          const updatedTagged = [...tags, updatedTag].filter(Boolean)
          console.log({ updatedTagged })
          user.set({
            athletes: {
              tagged: updatedTagged,
            },
          })

          const updatedUser = await user.save()
          const response = updatedUser.athletes.tagged.find(
            v => v.id === id
          ) || { id, tag: 0 }

          return {
            ...response,
          }
        })
      },
    },
    user: {
      type: userType,
      description: "Modify user configuration states",
      args: {
        bypassAttendanceConfirmation: {
          type: GraphQLBoolean,
          description: "Should the 'Confirm I'm going' attendance appear?",
        },
      },
      resolve: (_, args, { user: { username } }) => {
        return User.findOne({ "name.login": username }).then(async user => {
          if ("bypassAttendanceConfirmation" in args) {
            user.set({
              preferences: {
                bypassAttendanceConfirmation: args.bypassAttendanceConfirmation,
              },
            })
          }

          return await user.save()
        })
      },
    },
    event: {
      type: eventType,
      description: "Toggle interaction state of a user on single event profile",
      args: {
        eventId: {
          type: GraphQLInt,
          description: "Event ID",
        },
        interaction: {
          type: GraphQLString,
          description: "Interaction type",
        },
      },
      resolve: (_, { eventId, interaction }, { user: { username } }) => {
        return User.findOne({ "name.login": username }).then(async user => {
          const {
            events: {
              [interaction]: interactions = [],
              attending,
              tracking,
            } = {},
          } = user

          if (interactions.includes(eventId)) {
            // already in this set, so we have to exclude it
            if (interaction === "tracking" && attending.includes(eventId)) {
              console.log("BYPASS")
            } else {
              user.set({
                events: {
                  [interaction]: interactions.filter(id => id !== eventId),
                },
              })
            }
          } else {
            // does not exist in set, we must include it

            const forcedTracking =
              interaction === "attending"
                ? {
                    ["tracking"]: uniq([...attending, eventId]),
                  }
                : {}
            user.set({
              events: {
                [interaction]: uniq([...interactions, eventId]),
                ...forcedTracking,
              },
            })
          }

          const updatedUserData = await user.save()
          const response = await Event.findOne({ id: eventId }).lean()

          return {
            ...response,
            tracking: updatedUserData.events.tracking.includes(eventId),
            attending: updatedUserData.events.attending.includes(eventId),
          }
        })
      },
    },
    events: {
      type: eventsResponseType,
      description: "Toggle tracking state for a user to an event",
      args: {
        eventId: {
          type: GraphQLInt,
          description: "Event ID",
        },
        trackingState: {
          type: GraphQLInt,
          description: "New event flagging stats",
        },
      },
      resolve: (_, { eventId, trackingState }, { user: { username } }) => {
        return User.findOne({ "name.login": username }).then(async user => {
          const { events: { tracking, attending } = {} } = user

          if (trackingState === 3) {
            // both track and attend
            user.set({
              "events.tracking": uniq([...tracking, eventId]),
            })
            user.set({
              "events.attending": uniq([...attending, eventId]),
            })
          } else if (trackingState === 2) {
            // tracking only
            user.set({
              "events.attending": attending.filter(id => id !== eventId),
            })
            user.set({ "events.tracking": uniq([...tracking, eventId]) })
          } else if (trackingState === 1) {
            // remove from all trackers
            user.set({
              "events.tracking": tracking.filter(id => id !== eventId),
            })
            user.set({
              "events.attending": attending.filter(id => id !== eventId),
            })
          }

          const updatedUserData = await user.save()
          const response = await Event.findOne({ id: eventId }).lean()

          return {
            results: [
              {
                ...response,
                tracking: updatedUserData.events.tracking.includes(eventId),
                attending: updatedUserData.events.attending.includes(eventId),
              },
            ],
          }
        })
      },
    },
  }),
})

const schema = new GraphQLSchema({ query: rootQuery, mutation: rootMutation })

module.exports = graphqlHTTP(req => ({
  schema,
  graphiql: true,
  context: { user: req.user },
}))

// module.exports = graphqlHTTP(request => console.log({ request: request.user }))
