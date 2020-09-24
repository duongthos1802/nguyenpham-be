import _ from 'lodash'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
// models
import models from '../models'
// helpers
import { stringHelper } from './index'

dotenv.config()

/**
 * CHECK USER FIRST TIME
 * @param {*} user
 */
export const checkUserFirstTime = (user) => {
  if (!user) {
    return false
  }
  const { username } = user

  return !!(
    !_.isNil(username) &&
    !_.isEmpty(username)
  )
}

/**
 * GENERATE USER TOKEN
 * @param {*} user
 */
export const generateUserToken = (user) => {
  if (!user) {
    return null
  }

  return jwt.sign(
    {
      userId: user._id,
      isAdmin: !!user.isAdmin
    },
    process.env.APP_SECRET
  )
}

/**
 * CHECK EXIST MAIL
 * @param {*} username
 * @param {*} userId
 */
export const checkExistUser = async (username, userId) => {
  if (!username) {
    return false
  }

  const usernameLowercase = stringHelper.trimAndLowercaseText(username)
  const keywordRegex = stringHelper.regexMongooseKeyword(usernameLowercase)
  const queryClause = {
    username: keywordRegex
  }
  if (userId) {
    queryClause._id = {
      $ne: userId
    }
  }
  console.log('queryClause...', queryClause)
  console.log('models.User...', models.User)
  console.log('models...', models)

  return await models.User.findOne(queryClause)
}

/**
 * CHECK USER PASSWORD
 * @param {*} password
 * @param {*} comparePassword
 */
export const checkUserPassword = async (password, comparePassword) => {
  return await bcrypt.compare(password, comparePassword)
}

export default {
  checkExistUser,
  checkUserPassword,
  generateUserToken,
  checkUserFirstTime
}