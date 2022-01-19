import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')


      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token!')
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export { protect, admin }

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZTA3NGQzYjdlNWNiNjNiNjRjMjdmNiIsImlhdCI6MTY0MjQ1NTAwNiwiZXhwIjoxNjQ1MDQ3MDA2fQ.1RVa1gdidyiJsdrs2-h65yYE4yBb8SIj5zTB03IgOtg
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZTA3NGQzYjdlNWNiNjNiNjRjMjdmNiIsImlhdCI6MTY0MjQ1NTAwNiwiZXhwIjoxNjQ1MDQ3MDA2fQ.1RVa1gdidyiJsdrs2-h65yYE4yBb8SIj5zTB03IgOtg