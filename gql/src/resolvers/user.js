import User from "../schema/user"

export default async (_, args, { user }) => {
  return User.findOne({ "name.login": user.username }).lean()
}
