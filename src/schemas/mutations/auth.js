import { ApolloError } from 'apollo-server-express'
// models
import models from '../../models'
// composer
import composer from '../composer'
// extensions
import { 
  dateTimeHelper, 
  stringHelper, 
  userHelper 
} from '../../extension'
// constants
import {
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_CREATE_ONE,
  RESOLVER_FIND_BY_ID,
  RESOLVER_REMOVE_MANY,
  RESOLVER_FIND_ONE,
  RESOLVER_FIND_MANY
} from '../../constants/resolver'
import { ERROR_MESSAGE } from '../../constants/errorCode'


const createUserSession = async (userId) => {
  if (!userId) {
    return null
  }
  const userSession = await composer.UserSessionTC.getResolver(
    RESOLVER_CREATE_ONE
  ).resolve({
    args: {
      record: {
        user: userId
      }
    }
  })
  if (userSession) {
    return userSession.record
  }
  return null
}

const createSessionAndToken = async ({
  user = {}
}) => {
  // create user session
  const userSession = await createUserSession(user._id)

  // create user token
  const userToken = userHelper.generateUserToken(user)

  return {
    userSession,
    userToken
  }
}

const auth = {
  checkUserSession: {
    type: composer.UserTC,
    args: {
      sessionId: 'ID!'
    },
    resolve: async (_, { sessionId }, context, info) => {
      try {
        // 1. check valid session id
        if (!stringHelper.validateMongoDBObjectId(sessionId)) {
          return new ApolloError(
            ERROR_MESSAGE.USER_NOT_FOUND.text,
            ERROR_MESSAGE.USER_NOT_FOUND.extensionCode
          )
        }

        // 2. query user session
        const session = await composer.UserSessionTC.getResolver(
          RESOLVER_FIND_BY_ID
        ).resolve({
          args: {
            _id: sessionId
          }
        })

        if (!session) {
          return new ApolloError(
            ERROR_MESSAGE.UNAUTHORIZED.text,
            ERROR_MESSAGE.UNAUTHORIZED.extensionCode
          )
        }

        // 3. query user
        const user = await context.models.User.findById(session.user)
        if (!user) {
          return new ApolloError(
            ERROR_MESSAGE.UNAUTHORIZED.text,
            ERROR_MESSAGE.UNAUTHORIZED.extensionCode
          )
        }

        // 5. check user first time
        const userFirstTime = userHelper.checkUserFirstTime(user)
        if (userFirstTime !== user.firstTime) {
          await composer.UserTC.getResolver(RESOLVER_UPDATE_BY_ID).resolve({
            args: {
              record: {
                _id: user._id,
                firstTime: userFirstTime
              }
            }
          })
        }

        return user
      } catch (error) {
        throw new Error(error)
      }
    }
  },
  loginAdmin: {
    type: composer.AuthAdminTC,
    args: {
      username: 'String!',
      password: 'String!'
    },
    resolve: async (_, { username, password }, context, info) => {
      try {
        // 1. trim username
        const usernameLowercase = stringHelper.trimAndLowercaseText(username)

        // 2. query user by username
        const user = await userHelper.checkExistUser(usernameLowercase)

        // 3. check exist user
        if (!user) {
          return new ApolloError(
            ERROR_MESSAGE.USER_NOT_FOUND.text,
            ERROR_MESSAGE.USER_NOT_FOUND.extensionCode
          )
        }

        if (!user.password) {
          return new ApolloError(
            ERROR_MESSAGE.USER_PASSWORD_NOT_MATCH.text,
            ERROR_MESSAGE.USER_PASSWORD_NOT_MATCH.extensionCode
          )
        }

        // 4. check valid password
        const validPassword = await userHelper.checkUserPassword(
          password,
          user.password
        )

        if (!validPassword) {
          return new ApolloError(
            ERROR_MESSAGE.USER_PASSWORD_NOT_MATCH.text,
            ERROR_MESSAGE.USER_PASSWORD_NOT_MATCH.extensionCode
          )
        }

        if (!user.isAdmin) {
          return new ApolloError(
            ERROR_MESSAGE.ACCESS_DENIED.text,
            ERROR_MESSAGE.ACCESS_DENIED.extensionCode
          )
        }

        // 5. reset user first time and update time Login by user
        const userFirstTime = userHelper.checkUserFirstTime(user)
        if (userFirstTime !== user.firstTime) {
          user.firstTime = userFirstTime
          await composer.UserTC.getResolver(RESOLVER_UPDATE_BY_ID).resolve({
            args: {
              record: {
                _id: user._id,
                firstTime: userFirstTime
              }
            }
          })
        } else {
          await composer.UserTC.getResolver(RESOLVER_UPDATE_BY_ID).resolve({
            args: {
              record: {
                _id: user._id,
                lastActive: dateTimeHelper.initNewDate()
              }
            }
          })
        }

        // 6. create session and token
        const { userSession, userToken } = await createSessionAndToken({
          user: user
        })

        return {
          token: userToken,
          user: user,
          userSession: userSession
        }
      } catch (error) {
        console.log('errrororor', error)
        throw new Error(error)
      }
    }
  },
}

export default auth