import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
import { RESOLVER_FIND_BY_ID } from '../../constants/resolver'
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
// import { customizationOptions } from '../customizationOptions'
// composer
import composer from '../composer'

export const UserSessionTC = composeWithDataLoader(
  composeWithMongoose(models.UserSession),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

UserSessionTC.addRelation('user', {
  resolver: () => composer.UserTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.user
  },
  projection: { user: 1 }
})

export default UserSessionTC
