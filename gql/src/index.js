import express from "express"
import bodyparser from "body-parser"
import expressHandlebars from "express-handlebars"
import path from "path"
import graphql from "./gq.js"
import mongoose from "mongoose"
import GenerateMockDataRouter from "./datamock"
import passportJWT from "passport-jwt"
import exjwt from "express-jwt"
import bcrypt from "bcrypt-nodejs"

import User from "./schema/user"

const { Strategy: JWTStrategy, ExtractJwt } = passportJWT
const saltRounds = 10
const server = express()

const SERVER_SECRET_KEY = "keyboard cat 4 ever"

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
  secret: SERVER_SECRET_KEY,
  // credentialsRequired: false, // process.env.NODE_ENV to bypass for dev env?
})

server.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  // res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization")
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
