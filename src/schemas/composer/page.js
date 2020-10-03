import { composeWithMongoose } from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// constant
import { CACHE_EXPIRATION } from '../../constants/cache'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_COUNT,
  RESOLVER_PAGE_FIND_MANY,
  RESOLVER_PAGE_COUNT
} from '../../constants/resolver'
// extensions
import { stringHelper } from '../../extensions'
// options
import { customizationOptions } from '../customizationOptions'

export const PageTC = composeWithDataLoader(
  composeWithMongoose(models.Page, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

// CUSTOM RESOLVER
const resolverFindMany = PageTC.getResolver(RESOLVER_FIND_MANY)
const resolverCount = PageTC.getResolver(RESOLVER_COUNT)

PageTC.setResolver(
  RESOLVER_PAGE_FIND_MANY,
  resolverFindMany.addFilterArg({
    name: 'keyword',
    type: 'String',
    query: (rawQuery, value) => {
      rawQuery.name = stringHelper.regexMongooseKeyword(value)
    }
  })
)

PageTC.setResolver(
  RESOLVER_PAGE_COUNT,
  resolverCount.addFilterArg({
    name: 'keyword',
    type: 'String',
    query: (rawQuery, value) => {
      rawQuery.name = stringHelper.regexMongooseKeyword(value)
    }
  })
)

export default PageTC
