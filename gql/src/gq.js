import graphqlHTTP from "express-graphql"
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLList,
} from "graphql"
import uniq from "lodash/uniq"

import athletesType from "./types/athlete"
import scheduleType from "./types/schedule"
import eventType from "./types/event"
import eventsResponseType from "./types/eventReponse"
import teamsResponseType from "./types/teamResponse"
import userType from "./types/user"
import athletesResponseType from "./types/athleteResponse"
import scheduleResponseType from "./types/scheduleResponse"

import Event from "./schema/events"
import User from "./schema/user"
import Schedule from "./schema/schedules"

import TeamsResolver from "./resolvers/teams"
import AthletesResolver from "./resolvers/athletes"
import EventsResolver from "./resolvers/events"
import EventResolver from "./resolvers/event"
import UserResolver from "./resolvers/user"
import ScheduleResolver from "./resolvers/schedule"

const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    schedules: {
      type: scheduleResponseType,
      args: {
        id: {
          type: GraphQLString,
        },
        event: {
          type: GraphQLInt,
        },
        page: {
          type: GraphQLInt,
        },
        perPage: {
          type: GraphQLInt,
        },
        tracked: {
          type: GraphQLBoolean,
          description: "Team is being tracked?",
        },
      },
      resolve: ScheduleResolver,
    },
    athletes: {
      type: athletesResponseType,
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
      resolve: (queryContext, args, context) =>
        AthletesResolver(queryContext, args, { ...context }),
    },
    event: {
      type: eventType,
      args: {
        id: {
          type: GraphQLInt,
          description: "Specific event id",
        },
      },
      resolve: EventResolver,
    },
    teams: {
      type: teamsResponseType,
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
        state: {
          type: new GraphQLList(GraphQLString),
        },
        tracked: {
          type: GraphQLBoolean,
          description: "Team is being tracked?",
        },
        sport: {
          type: GraphQLInt,
          description: "Sport associated with this team",
        },
        event: {
          type: GraphQLInt,
          description:
            "Event ID of an event that a team may be participating in",
        },
      },
      resolve: TeamsResolver,
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
      resolve: EventsResolver,
    },
    user: {
      type: userType,
      resolve: UserResolver,
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
    schedule: {
      type: scheduleType,
      description: "Modify schedule data on the user record",
      args: {
        id: {
          type: GraphQLString,
          description: "Scheduled event to toggle tracking on",
        },
      },
      resolve: (_, args, { user: { username } }) => {
        return User.findOne({
          "name.login": username,
        }).then(async user => {
          const { schedule: { tracking = [] } = {} } = user

          const alreadyTracking = tracking.includes(args.id)

          const updatedTracking = alreadyTracking
            ? tracking.filter(v => v !== args.id)
            : [...tracking, args.id]

          user.set({
            schedule: {
              tracking: updatedTracking,
            },
          })

          const updatedUser = await user.save()
          const response = updatedUser.schedule.tracking.includes(args.id)

          return {
            id: args.id,
            tracking: response,
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
