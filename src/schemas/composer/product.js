import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'
import { RESOLVER_FIND_BY_ID, RESOLVER_PRODUCT_FIND_MANY, RESOLVER_FIND_MANY } from '../../constants/resolver'
import composer from '../composer'
import { ProductStatus } from './enum'

export const ProductTC = composeWithDataLoader(
  composeWithMongoose(models.Product, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

ProductTC.addRelation('category', {
  resolver: () => composer.CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.category
  },
  projection: { category: 1 }
})

// CUSTOM RESOLVER
const resolverFindMany = ProductTC.getResolver(RESOLVER_FIND_MANY)

ProductTC.setResolver(
  RESOLVER_PRODUCT_FIND_MANY,
  resolverFindMany
    .addFilterArg({
      name: 'keyword',
      type: 'String',
      query: (rawQuery, value) => {
        rawQuery.name = stringHelper.regexMongooseKeyword(value)
      }
    })
    .addFilterArg({
      name: 'status_not_in',
      type: [ProductStatus],
      query: (rawQuery, value) => {
        rawQuery.status = { $nin: value }
      }
    })
    // .addFilterArg({
    //   name: 'date_lte',
    //   type: [ProductStatus],
    //   query: (rawQuery, value) => {
    //     rawQuery.date = { $lte: value }
    //   }
    // })
    //.addFilterArg({
    //   name: 'date_gte',
    //   type: [ProductStatus],
    //   query: (rawQuery, value) => {
    //     rawQuery.date = { $gte: value }
    //   }
    // })
    .addSortArg({
      name: 'viewCount_DESC',
      value: () => {
        return { viewCount: -1 }
      }
    })
    .addSortArg({
      name: 'date_DESC',
      value: () => {
        return { date: -1 }
      }
    })
    .addSortArg({
      name: 'date_ASC',
      value: () => {
        return { date: 1 }
      }
    })
    .addSortArg({
      name: 'name_DESC',
      value: () => {
        return { name: -1 }
      }
    })
    .addSortArg({
      name: 'name_ASC',
      value: () => {
        return { name: 1 }
      }
    })

)
export default ProductTC
