import User from "../schema/user"
import Event from "../schema/events"
import uniq from "lodash/uniq"

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

const searchTextFilter = val =>
  val.length === 0 ? null : { name: { $regex: val, $options: "i" } }

export default async (_, args, { user: { email } }) => {
  const userData = await User.findOne({
    email,
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
            uniq([...userData.events.tracking, ...userData.events.attending])
          )
        : {}),
      ...(args.id || args.tracked || args.organizer
        ? {}
        : dateFilters(start_date, end_date)),
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
}
