import User from "../schema/user"

export default async (_, args, { user: { email } }) => {
  return User.findOne({ email }).lean()
}
