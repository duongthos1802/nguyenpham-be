import _ from 'lodash'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
// models
import models from '..'
// composer
import composer from '../../schemas/composer'
// constant
import { SALT_WORK_FACTOR } from '../../constants'
// extensions
import { stringHelper, numberHelper } from '../../extensions'
import {
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_CREATE_ONE
} from '../../constants/resolver'

/**
 * CHECK USER PASSWORD
 * @param {*} password
 * @param {*} comparePassword
 */
export const checkUserPassword = async (password, comparePassword) => {
  return await bcrypt.compare(password, comparePassword)
}

/**
 * GENERATE PASSWORD HASH
 * @param {*} password
 */
export const generatePasswordHash = async (password) => {
  // 1. generate a salt
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)

  // 2. generate a hash for password
  return await bcrypt.hash(password, salt)
}

/**
 * CHECK USER FIRST TIME
 * @param {*} user
 */
export const checkUserFirstTime = (user) => {
  if (!user) {
    return false
  }
  const { location, mail, phone, name } = user
  const locationText = location ? location.text : null

  return !!(
    !_.isNil(locationText) &&
    !_.isNil(mail) &&
    !_.isNil(phone) &&
    !_.isNil(name) &&
    !_.isEmpty(locationText) &&
    !_.isEmpty(mail) &&
    !_.isEmpty(phone) &&
    !_.isEmpty(name)
  )
}

/**
 * GENERATE USER TOKEN
 * @param {*} userId
 */
export const generateUserToken = (userId) => {
  if (!userId) {
    return null
  }

  return jwt.sign(
    {
      userId: userId
    },
    process.env.APP_SECRET
  )
}

/**
 * GET USER NAME
 * @param {*} user
 */
export const getUsername = (user) => {
  if (!user) {
    return null
  }
  if (user.name) {
    return user.name
  }
  if (user.mail) {
    return user.mail
  }
  return null
}

/**
 * CHECK EXIST MAIL
 * @param {*} email
 * @param {*} userId
 */
export const checkExistMail = async (email, userId) => {
  if (!email) {
    return false
  }

  const mail = stringHelper.trimAndLowercaseText(email)
  const keywordRegex = stringHelper.regexMongooseKeyword(mail)
  const queryClause = {
    mail: keywordRegex
  }
  if (userId) {
    queryClause._id = {
      $ne: userId
    }
  }

  return await models.User.findOne(queryClause)
}

export const updateProductCountByUserId = async ({
  userId,
  isIncrease = true
}) => {
  if (!userId) {
    return
  }
  // 1. get user info
  const user = await models.User.findOne({ _id: userId })
  if (!user) {
    return null
  }

  // 2. update user product
  const currentProduct = numberHelper.addNumber(
    user.products,
    isIncrease ? 1 : -1
  )

  return updateUserProduct({
    userId: userId,
    productCount: currentProduct
  })
}

export const updateProductCount = async ({ userId, productCount }) => {
  if (!userId) {
    return null
  }
  const dataClause = {
    _id: userId,
    products: numberHelper.getPositiveNumber(productCount)
  }

  return await composer.UserTC.getResolver(RESOLVER_UPDATE_BY_ID).resolve({
    args: {
      record: dataClause
    }
  })
}

export const updateProductCountOfListUsers = async ({ listUsers = [] }) => {
  if (!listUsers || listUsers.length === 0) {
    return
  }

  await Promise.all(
    listUsers.map(async (user) => {
      await updateProductCount({
        userId: user._id,
        productCount: user.products
      })
    })
  )
}

export const updateUserAddress = async ({ address, userId }) => {
  // 1. create new address
  const addressRecord = await composer.AddressTC.getResolver(
    RESOLVER_CREATE_ONE
  ).resolve({
    args: {
      record: {
        ...address,
        user: userId
      }
    }
  })

  // 2. update user address
  if (addressRecord) {
    await composer.UserTC.getResolver(RESOLVER_UPDATE_BY_ID).resolve({
      args: {
        record: {
          _id: userId,
          userAddress: addressRecord.recordId
        }
      }
    })
  }
}

export default {
  checkUserPassword,
  generatePasswordHash,
  checkUserFirstTime,
  generateUserToken,
  getUsername,
  checkExistMail,
  updateProductCountByUserId,
  updateProductCount,
  updateProductCountOfListUsers,
  updateUserAddress
}
