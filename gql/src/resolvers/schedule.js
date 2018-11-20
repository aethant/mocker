import User from "../schema/user"
import Schedule from "../schema/schedules"

export default async (_, args, { user }) => {
  const userData = await User.findOne({
    "name.login": user.username,
  }).lean()

  const { page = 1, perPage = 10 } = args
  const pagination =
    page && perPage
      ? {
          skip: perPage * (page - 1),
          limit: perPage,
        }
      : {}

  const prefilters = Object.keys(args).reduce((aggregator, key) => {
    return key !== "page" && key !== "perPage"
      ? {
          ...aggregator,
          [key]: args[key],
        }
      : aggregator
  }, {})

  const filters = Object.keys(prefilters).reduce(
    (aggregator, v) => {
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

  const count = await Schedule.find({
    sport: userData.sport,
  })
    .count()
    .lean()

  const filtered = await Schedule.find({ ...filters })
    .count()
    .lean()

  const data = await Schedule.find({ ...filters })
    .limit(pagination.limit)
    .skip(pagination.skip)
    .lean()

  const results = data.reduce((aggregator, element) => {
    return [
      ...aggregator,
      {
        ...element,
        tracking: userData.schedule.tracking.includes(element.id),
      },
    ]
  }, [])

  return {
    _meta: {
      count,
      filtered,
    },
    results,
  }
}
