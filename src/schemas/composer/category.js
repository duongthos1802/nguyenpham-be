import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'

export const CategoryTC = composeWithDataLoader(
  composeWithMongoose(models.Category, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

export default CategoryTC
