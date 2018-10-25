import { Router } from "express"
import mongoose from "mongoose"
import EventData from "./data/events"
import eventSchema from "./schema/events"
import userSchema from "./schema/user"

const r = new Router()

r.get("/generate/events", (req, res) => {
  const Event = mongoose.model("Events", eventSchema)
  EventData.forEach(event => {
    const evt = new Event({ ...event })
    evt.save((err, v) => {
      if (err) {
        console.error("Event save error", { err })
        return res.sendStatus(500)
      }

      console.log(`Event #${v.id} saved.`)
      return res.sendStatus(201)
    })
  })
})

r.get("/delete/events", (req, res) => {
  const Event = mongoose.model("Events", eventSchema)
  Event.collection.remove({})
  return res.sendStatus(200)
})

r.get("/generate/user", (req, res) => {
  const User = mongoose.model("User", userSchema)
  const user = new User({
    name: {
      login: "test",
      first: "John",
      last: "Smith",
    },
    email: "test@example.org",
    school: {
      name: "Hardknocks",
      title: "Head Coach",
    },
    events: {
      tracking: [],
      attending: [],
    },
  })

  user.save((err, v) => {
    if (err) {
      console.error("User save error", { err })
      return res.sendStatus(500)
    }

    console.log(`User saved.`)
    return res.sendStatus(201)
  })
})

export default r
