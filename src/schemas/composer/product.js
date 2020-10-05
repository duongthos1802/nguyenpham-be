import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// composer
import composer from '../composer'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
import { ProductStatus } from './enum'
import { 
  RESOLVER_FIND_BY_ID, 
  RESOLVER_PRODUCT_FIND_MANY, 
  RESOLVER_FIND_MANY, 
  RESOLVER_PRODUCT_COUNT, 
  RESOLVER_COUNT 
} from '../../constants/resolver'
// options
import { customizationOptions } from '../customizationOptions'
// extensions
import { stringHelper } from '../../extensions'

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
const resolverCount = ProductTC.getResolver(RESOLVER_COUNT)

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

ProductTC.setResolver(
  RESOLVER_PRODUCT_COUNT,
  resolverCount
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
)

export default ProductTC
