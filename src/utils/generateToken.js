import jwt from 'jsonwebtoken'

export const generateToken = userId => {
  return jwt.sign({ userId }, 'thisisasecret', {
        expiresIn: "7 days"
      })
}