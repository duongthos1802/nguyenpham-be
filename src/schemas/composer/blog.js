import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'
//composer
import composer from '../composer'
import { RESOLVER_BLOG_FIND_MANY, RESOLVER_PRODUCT_COUNT, RESOLVER_FIND_MANY, RESOLVER_COUNT, RESOLVER_FIND_BY_ID, RESOLVER_BLOG_COUNT } from '../../constants/resolver'

export const BlogTC = composeWithDataLoader(
  composeWithMongoose(models.Blog, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

BlogTC.addRelation('category', {
  resolver: () => composer.CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.category
  },
  projection: { category: 1 }
})


const resolverFindMany = BlogTC.getResolver(RESOLVER_FIND_MANY)
const resolverCount = BlogTC.getResolver(RESOLVER_COUNT)

BlogTC.setResolver(
  RESOLVER_BLOG_FIND_MANY,
  resolverFindMany
    .addFilterArg({
      name: 'keyword',
      type: 'String',
      query: (rawQuery, value) => {
        rawQuery.name = stringHelper.regexMongooseKeyword(value)
      }
    })
    .addSortArg({
      name: 'viewCount_DESC',
      value: () => {
        return { viewCount: -1 }
      }
    })
    .addSortArg({
      name: 'date_DESC',
      value: () => {
        return { createdAt: -1 }
      }
    })
    .addSortArg({
      name: 'date_ASC',
      value: () => {
        return { createdAt: 1 }
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

BlogTC.setResolver(
  RESOLVER_BLOG_COUNT,
  resolverCount
    .addFilterArg({
      name: 'keyword',
      type: 'String',
      query: (rawQuery, value) => {
        rawQuery.name = stringHelper.regexMongooseKeyword(value)
      }
    })
)

export default BlogTC
