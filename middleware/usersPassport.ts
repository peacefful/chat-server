import passportJWT from 'passport-jwt'
import passport from 'passport'
import { keyJwt } from '../config/key'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keyJwt
}

export const usersPassport = () => {
  passport.use(
    new JwtStrategy(JwtOptions, async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: payload.id
          }
        })
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      } catch (error) {
        return done(error, false)
      }
    })
  )
}
