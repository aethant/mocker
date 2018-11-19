import Teams from "../schema/teams"
import User from "../schema/user"

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

  const count = await Teams.find({
    sport: userData.sport,
  })
    .count()
    .lean()

  const filtered = await Teams.find(filters)
    .count()
    .lean()

  const data = await Teams.find(filters)
    .limit(pagination.limit)
    .skip(pagination.skip)
    .lean()

  return {
    _meta: {
      count,
      filtered,
    },
    results: data,
  }
}
