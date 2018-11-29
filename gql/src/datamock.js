import { Router } from "express"
import mongoose from "mongoose"
import fetch from "node-fetch"
import shortid from "shortid"

import EventData from "./data/events"
import DemoEventData from "./data/demoevents"
import AthletesData from "./data/athletes"
import TeamsData from "./data/teams"
import ScheduleLocations from "./data/schedulelocations"

import Event from "./schema/events"
import User from "./schema/user"
import Athlete from "./schema/athletes"
import Team from "./schema/teams"
import Schedule from "./schema/schedules"

import parse from "date-fns/parse"
import getTime from "date-fns/get_time"

const r = new Router()

r.get("/generate/teams", async (req, res) => {
  const events = await Event.bySport()
  const athletes = await Athlete.bySport()

  await TeamsData.map(async team => {
    // for this sport, we have these events
    const eventsForThisSport = events[team.sport]
    // randomly assign a up to 10 events: Math.floor(Math.random() * 10) + 1
    let eventsAttending = []
    for (let i = 0; i <= Math.floor(Math.random() * 10) + 1; i++) {
      eventsAttending.push(
        eventsForThisSport[
          Math.floor(Math.random() * eventsForThisSport.length)
        ]
      )
    }

    const athletesForThisSport = athletes[team.sport]
    let athletesOnTeam = []
    for (let i = 0; i <= 5; i++) {
      // always 5 players on a team... but we have no checking for existing player ids, so this creates a certain
      // amount of "fuzz" which isn't necessarily a bad thing.
      athletesOnTeam.push(
        athletesForThisSport[
          Math.floor(Math.random() * athletesForThisSport.length)
        ]
      )
    }

    const tteam = new Team({
      ...team,
      events: eventsAttending,
      athletes: athletesOnTeam,
    })

    await tteam.save((err, v) => {
      if (err) {
        console.error("Team save error", { err })
        return res.sendStatus(500)
      }

      console.log(`Team #${v.id} saved.`)
    })
  })

  return res.sendStatus(201)
})

// oh god, a closure... in the wild.
// make sure the same team isn't playing itself.
// obligatory gif: https://media2.giphy.com/media/zNXvBiNNcrjDW/giphy.webp?cid=3640f6095bf2e7c2727944466f833811
const generateOpposingTeam = (ht, opposerCount) => {
  const opposingTeam = () => {
    const opp = Math.floor(Math.random() * opposerCount)
    if (opp === ht) {
      opposingTeam()
    }

    return opp
  }

  return opposingTeam()
}

r.get("/generate/rollschedules", async (req, res) => {
  await Schedule.find({ sport: 2 }).then(schedules => {
    schedules.forEach(async schedule => {
      schedule.set({ event: 22 })
      await schedule.save()
    })
  })

  return res.sendStatus(203)
})

r.get("/generate/schedules", async (req, res) => {
  const totalScheduleLocations = ScheduleLocations.length
  const teams = await Team.bySport()
  const events = await Event.bySport()

  const sportsForTeamsKeys = Object.keys(teams)

  sportsForTeamsKeys.map(sport => {
    const teamBySport = teams[sport]
    const matchups = teamBySport.map(teamA => ({
      teamA,
      teamB: generateOpposingTeam(teamA, teamBySport.length),
    }))

    matchups.forEach(async playingteams => {
      const { teamA, teamB } = playingteams
      const { location } = ScheduleLocations[
        Math.floor(Math.random() * totalScheduleLocations)
      ]

      const event = Math.floor(Math.random() * events[sport].length)

      const entry = new Schedule({
        id: shortid(),
        sport,
        location,
        event,
        teams: [teamA, teamB],
        start_time: new Date(
          +new Date() + Math.floor(Math.random() * 10000000000)
        ),
      })

      await entry.save((err, ent) => {
        if (err) {
          console.error(`Error generating schedule entry`, { err })
        }

        console.info(`Created ${ent.id} schedule entry.`)
      })
    })
  })
  return res.sendStatus(201)
})

r.get("/generate/events", (req, res) => {
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

r.get("/generate/demoevents", (req, res) => {
  DemoEventData.forEach(event => {
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
  Event.collection.remove({})
  return res.sendStatus(200)
})

r.get("/delete/athletes", (req, res) => {
  Athlete.collection.remove({})
  return res.sendStatus(200)
})

r.get("/generate/user", (req, res) => {
  const user = new User({
    id: 1,
    name: {
      login: "test",
      first: "John",
      last: "Smith",
    },
    sport: 2,
    email: "test@example.org",
    school: {
      name: "Hardknocks",
      title: "Head Coach",
    },
    events: {
      tracking: [],
      attending: [],
    },
    athletes: {
      tagged: [],
      notes: {
        8: {
          1542378916: { content: "Foo" },
        },
        10: {},
      },
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
