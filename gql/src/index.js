import express from "express"
import bodyparser from "body-parser"
import expressHandlebars from "express-handlebars"
import path from "path"
import winston from "winston"
import graphql from "./gq.js"
import mongoose from "mongoose"
import GenerateMockDataRouter from "./datamock"
import passport from "passport"
import passportJWT from "passport-jwt"
import userSchema from "./schema/user"
import jwt from "jsonwebtoken"
import exjwt from "express-jwt"

const { Strategy: JWTStrategy, ExtractJwt } = passportJWT

const server = express()
// passport.use(
//   new JWTStrategy(
//     {
//       // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       // jwtFromRequest: ExtractJwt.fromHeader("coachlive_token"),
//       jwtFromRequest: ExtractJwt.fromBodyField("coachlive_token"),
//       secretOrKey: "keyboard cat 4 ever",
//     },
//     (jwtPayload, cb) => {
//       console.log("LOOKUP USER", jwtPayload)
//       const User = mongoose.model("User", userSchema)
//       return User.findOne({ "name.login": "test" })
//         .lean()
//         .then(user => cb(null, user))
//         .catch(err => cb(err))
//     }
//   )
// )

// const authenticate = (req, res, next) => {
//   console.log("inside auth")
//   passport.authenticate("jwt", (err, user) => {
//     console.log("inside jwt", { err, user })
//     if (err || !user) {
//       console.log("pp error", { err })
//       return res.status(403).send({ error: "Not authenticated" })
//     }

//     console.log({ user })
//     return next()
//   })(req, res, next)
// }

const handlebars = expressHandlebars.create({
  defaultLayout: "main", // what's the name of our default layout handlebars file?
  layoutsDir: "./src/server/views/layout", // where does our default layout handlebars template live?
  partialsDir: "./src/server/views/partials",
})

server.engine("handlebars", handlebars.engine)
server.set("view engine", "handlebars")
server.set("views", path.join(__dirname, "../views"))

// set up parsers
server.use(
  /\/((?!graphql).)*/,
  bodyparser.urlencoded({
    extended: true,
    limit: "10mb",
  })
)

server.use(
  /\/((?!graphql).)*/,
  bodyparser.json({
    extended: true,
    limit: "75mb",
  })
)

// https://github.com/auth0/express-jwt
const jwtMW = exjwt({
  secret: "keyboard cat 4 ever",
  // credentialsRequired: false, // process.env.NODE_ENV to bypass for dev env?
})

server.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

// http://johnzhang.io/options-request-in-express
server.options("*", (_, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  )
  res.send(200)
})

server.use(GenerateMockDataRouter)
server.use(jwtMW, graphql)

server.listen(8002, () => {
  console.log("Mock GraphQL listening on :8002")
  mongoose.connect(
    "mongodb://localhost/mock",
    { useNewUrlParser: true }
  )
  const db = mongoose.connection
  db.on("error", err => console.error({ err }))
  db.once("open", () => {
    console.info("MongoDB connection created!")
  })
})
