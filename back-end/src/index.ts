import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
const app = express();
import "./auth/strategies"; 
var session = require('express-session');
var bodyParser = require('body-parser')
var passport = require('passport')

const prisma = new PrismaClient();
const PORT = process.env.PORT || 8888

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  })
)

app.use(passport.initialize())
app.use(passport.session())

// app.post(`/signup`, async (req, res) => {
//   const { name, email, password } = req.body

//   const result = await prisma.user.create({
//     data: {
//       name,
//       email,
//       password
//     },
//     select: {
//       username: true,
//       email: true,
//       password: false
//     }
//   })
//   res.json(result)
// })

app.get('/login', (req: Request, res: Response)=> {
  try {
    res.status(200);
  } catch (error) {
    
  }
  
})

app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }))

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    console.log(req.session);
    console.log(users);

    return users ? res.send(users) : res.sendStatus(400);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.sendStatus(500); 
  }


})

const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
)
