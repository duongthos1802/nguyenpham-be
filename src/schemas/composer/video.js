import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// composer
import composer from '../composer'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'
import { RESOLVER_FIND_BY_ID, RESOLVER_VIDEO_FIND_MANY, RESOLVER_VIDEO_COUNT, RESOLVER_FIND_MANY, RESOLVER_COUNT } from '../../constants/resolver'

export const VideoTC = composeWithDataLoader(
  composeWithMongoose(models.Video, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

VideoTC.addRelation('category', {
  resolver: () => composer.CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.category
  },
  projection: { category: 1 }
})

const resolverFindMany = VideoTC.getResolver(RESOLVER_FIND_MANY)
const resolverCount = VideoTC.getResolver(RESOLVER_COUNT)

VideoTC.setResolver(
  RESOLVER_VIDEO_FIND_MANY,
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

VideoTC.setResolver(
  RESOLVER_VIDEO_COUNT,
  resolverCount
    .addFilterArg({
      name: 'keyword',
      type: 'String',
      query: (rawQuery, value) => {
        rawQuery.name = stringHelper.regexMongooseKeyword(value)
      }
    })
)

export default VideoTC
