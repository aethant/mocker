import Athlete from "../schema/athletes"
import User from "../schema/user"

// build the appropriate lookup key for a query context
const getLookupId = (context, query) => {
  if (query === "team" && Boolean(context.athletes)) {
    return { id: { $in: context.athletes } }
  }

  if (query === "event" && Boolean(context.id)) {
    return { events: parseInt(context.id, 10) }
  }

  // no context, we're assuming a generic athlete query
  return {}
}

// build a dumb but appropriate string-based lookup query
const searchTextFilter = val =>
  val.length === 0
    ? null
    : {
        $or: [
          { firstName: { $regex: val, $options: "i" } },
          { lastName: { $regex: val, $options: "i" } },
        ],
      }

/**
 * Generic athlete info resolver. Manually add a "query" context with one of the following values
 * in your type description:
 *
 * "teams" - context of a team query
 * "events"
 */
export default async (context, args, { user, query }) => {
  const lookupHasContext = Boolean(context)
  const lookupIdFilter = lookupHasContext ? getLookupId(context, query) : {}

  const { page = 1, perPage, tag, hasNotes } = args
  const pagination =
    page && perPage
      ? {
          skip: perPage * (page - 1),
          limit: perPage,
        }
      : {}

  const submittedNotesAthleteIds = hasNotes
    ? await User.hasNotes(user.email)
    : []

  const taggedElements =
    tag && tag.length ? await User.taggedAs(user.email, tag) : []

  const specificIdsToEvaluate = [...submittedNotesAthleteIds, ...taggedElements]

  const filterBase =
    (tag && tag.length) || hasNotes
      ? {
          ...lookupIdFilter,
          id: { $in: specificIdsToEvaluate },
        }
      : {
          ...lookupIdFilter,
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

  const count = Athlete.find({})
    .count()
    .lean()

  const countAtEvent =
    lookupHasContext && lookupIdFilter.events
      ? Athlete.find({ ...lookupIdFilter })
          .count()
          .lean()
      : null

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
}
