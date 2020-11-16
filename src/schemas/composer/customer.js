import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'
import { RESOLVER_CREATE_ONE } from '../../constants/resolver'

export const CustomerTC = composeWithDataLoader(
  composeWithMongoose(models.Customer, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

export default CustomerTC
