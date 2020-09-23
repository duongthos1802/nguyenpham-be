import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from 'graphql-compose-dataloader'
// models
import models from '../../models'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'

export const ProductTC = composeWithDataLoader(
  composeWithMongoose(models.Product, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

export default ProductTC
