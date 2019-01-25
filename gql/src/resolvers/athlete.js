import User from "../schema/user"
import Athlete from "../schema/athletes"

export default async (_, { id, eventid }, { user: { email } }) => {
  // if eventid is populated, it means the APP view is from an event page,
  // not a "raw" view of the athlete
  // @TODO: modify the query to the appropriate service based on this fact (personal details, stats, etc.)

  const userData = await User.findOne({
    email,
  }).lean()

  const athleteData = await Athlete.findOne({ id })

  return {
    ...athleteData.toJSON(),
    profileUrl: "https://www.google.com",
  }
}
