import User from "../schema/user"
import Event from "../schema/events"
import uniq from "lodash/uniq"

const dateFilters = (start, end) => ({
  startDate: start
    ? {
        [`$gte`]: new Date(parseInt(start, 10) * 1000),
      }
    : null,
  endDate: end ? { [`$lt`]: new Date(parseInt(end, 10) * 1000) } : null,
})

const trackedFilters = ids => ({
  id: { $in: ids },
})

const searchTextFilter = val =>
  val.length === 0 ? null : { name: { $regex: val, $options: "i" } }

export default async (_, args, { user: { email } }) => {
  const userData = await User.findOne({
    email,
  }).lean()

  const { page = 1, perPage = 200, startDate, endDate } = args
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
        key !== "startDate" &&
        key !== "endDate" &&
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
            uniq([...userData.events.tracking, ...userData.events.attending])
          )
        : {}),
      ...(args.id || args.tracked || args.organizer
        ? {}
        : dateFilters(startDate, endDate)),
    }
  )

  const filters = Object.keys(prefilters).reduce(
    (aggregator, v) => {
      if (v === "searchText") {
        return {
          ...aggregator,
          ...searchTextFilter(args[v]),
        }
      }
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
    .sort("startDate")

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
}
