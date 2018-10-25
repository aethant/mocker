import express from "express"
import bodyparser from "body-parser"
import expressHandlebars from "express-handlebars"
import path from "path"
import winston from "winston"
import graphql from "./gq.js"

const server = express()

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

server.use("/graphql", graphql)

server.listen(8002, () => console.log("Mock GraphQL listening on :8002"))
