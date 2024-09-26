import { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
// var bcrypt = require('bcrypt')

const prisma = new PrismaClient()

passport.serializeUser((user: User, done: Function) => {
  console.log(`Inside serialize User `)
  console.log(user)

  done(null, user.id)
})
passport.deserializeUser(async (id: number, done: Function) => {
  console.log(`Inside deserializeUser `)
  console.log(`deserializeUser Id :${id}`)
  try {
    // const findUser=mockUser.find((user)=>user.id===id);
    const findUser = await prisma.user.findUniqueOrThrow({ where: { id } })
    if (!findUser) throw new Error('User not found')
    done(null, findUser)
  } catch (error) {
    done(error, null)
  }
})

export default passport.use( 
  new LocalStrategy(async (username: string, password: string, done: Function) => {
    console.log(`Username: ${username}`)
    console.log(`Password: ${password}`)
    try {
      //   const findUser =mockUser.find((user)=> user.username===username);
      //   if(!findUser) throw new Error("User not found");
      //   if(findUser.password !== password) throw new Error("Invalid Credentials");

      const findUser = await prisma.user.findUniqueOrThrow({ where: { username:String(username) } })
      console.log(findUser)
      if (!findUser) throw new Error('User not found')
      if (findUser.password !== password) throw new Error('Invalid Credentials')

      done(null, findUser)
    } catch (error) {
      done(error, null)
    }
  })
)
