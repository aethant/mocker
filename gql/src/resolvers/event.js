import User from "../schema/user"
import Event from "../schema/events"

export default async (_, args, { user: { email } }) => {
  const { id } = args
  const userData = await User.findOne({
    email,
  }).lean()

  const eventData = await Event.findOne({ id }).lean()

  return {
    ...eventData,
    tracking: userData.events.tracking.includes(id),
    attending: userData.events.attending.includes(id),
  }
}
