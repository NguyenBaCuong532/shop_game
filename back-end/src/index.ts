import { PrismaClient, User } from '@prisma/client';
import express, { Request, Response } from 'express';
const app = express();
import "./auth/strategies"; 
import { Cookie } from 'express-session';
import { Session } from 'inspector/promises';
var session = require('express-session');
var cookieParser = require('cookie-parser')
var passport = require('passport')

const prisma = new PrismaClient();
const PORT = process.env.PORT || 8888

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser("secret"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
      signed: true,
    },
  })
);
app.use(passport.initialize())
app.use(passport.session())

app.post(`/signup`, async (req:Request, res:Response) => {
  const { username, email, password } = req.body

  const result = await prisma.user.create({
    data: {
      username,
      email,
      password,
      
    },
    select: {
      username: true,
      email: true,
      password: false
    }
  })
  res.json(result)
})

app.get('/login', (req: Request, res: Response)=> {
  try {
    res.status(200);
  } catch (error) {
    
  }
  
})

 app.post('/login', passport.authenticate('local', { successRedirect: 'users' }))
// app.post('/login', passport.authenticate('local'),(req:Request,res:Response)=>{
//   res.send("OKOKOKOK")
//   console.log(req.session);
// })


app.get('/users', async (req:Request, res: Response) => {
  try {
    console.log(req.session);
    console.log(req.user);

    return req.user ? res.send(req.user) : res.sendStatus(400);
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
