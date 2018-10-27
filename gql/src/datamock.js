import { Router } from "express"
import mongoose from "mongoose"
import fetch from "node-fetch"

import EventData from "./data/events"
import AthletesData from "./data/athletes"

import eventSchema from "./schema/events"
import userSchema from "./schema/user"
import athleteSchema from "./schema/athletes"

import parse from "date-fns/parse"
import getTime from "date-fns/get_time"

const r = new Router()

r.get("/generate/events", (req, res) => {
  const Event = mongoose.model("Events", eventSchema)
  EventData.forEach(event => {
    const evt = new Event({
      ...event,
      start_time: getTime(parse(event.start_time)) / 1000,
      end_time: getTime(parse(event.end_time)) / 1000,
    })

    evt.save((err, v) => {
      if (err) {
        console.error("Event save error", { err })
        return res.sendStatus(500)
      }

      console.log(`Event #${v.id} saved.`)
    })
  })
  return res.sendStatus(201)
})

r.get("/generate/athletes", (req, res) => {
  const Athlete = mongoose.model("Athletes", athleteSchema)
  return fetch("https://randomuser.me/api/?results=1000&inc=picture")
    .then(resp => resp.json())
    .then(({ results: pics }) => {
      AthletesData.forEach((athlete, i) => {
        console.log({ d: getTime(parse(athlete.dob)) / 1000, dob: athlete.dob })
        const ath = new Athlete({
          ...athlete,
          profile_picture: pics[i].picture.large,
          dob: getTime(parse(athlete.dob)) / 1000,
          events: [
            ...new Set(
              athlete.events
                .split(",")
                .filter(i => i && i > 0)
                .map(n => parseInt(n, 10))
            ),
          ],
        })
        ath.save((err, v) => {
          if (err) {
            console.error("Athlete save error", { err })
            return res.sendStatus(500)
          }

          console.log(`Athlete #${v.id} saved.`)
        })
      })
    })
    .then(() => res.sendStatus(201))
    .catch(err => {
      console.error("Error creating athletes", { err })
      return res.sendStatus(500)
    })
})

r.get("/delete/events", (req, res) => {
  const Event = mongoose.model("Events", eventSchema)
  Event.collection.remove({})
  return res.sendStatus(200)
})

r.get("/delete/athletes", (req, res) => {
  const Athlete = mongoose.model("Athletes", athleteSchema)
  Athlete.collection.remove({})
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
