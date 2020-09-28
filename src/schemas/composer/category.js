import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'
import { RESOLVER_PRODUCT_FIND_MANY } from '../../constants/resolver'
import { ProductTC } from './product'

export const CategoryTC = composeWithDataLoader(
  composeWithMongoose(models.Category, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

CategoryTC.addFields({
  product: {
    type: [ProductTC],
    args: ProductTC.getResolver(RESOLVER_PRODUCT_FIND_MANY).getArgs(),
    resolve: (source, args, context, info) => {
      return ProductTC.getResolver(RESOLVER_PRODUCT_FIND_MANY).resolve({
        source,
        args,
        context,
        info,
        rawQuery: {
          category: source._id
        }
      })
    }
  }
})

export default CategoryTC
