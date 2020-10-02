import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// composer
import composer from '../composer'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
import {
  RESOLVER_FIND_BY_ID,
  RESOLVER_FIND_MANY,
  RESOLVER_BANNER_FIND_MANY,
  RESOLVER_BANNER_COUNT,
  RESOLVER_COUNT
} from '../../constants/resolver'
// options
import { customizationOptions } from '../customizationOptions'

export const BannerTC = composeWithDataLoader(
  composeWithMongoose(models.Banner, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

BannerTC.addRelation('recipe', {
  resolver: () => composer.RecipeTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.recipe
  },
  projection: { recipe: 1 }
})

BannerTC.addRelation('category', {
  resolver: () => composer.CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.category
  },
  projection: { category: 1 }
})

BannerTC.addRelation('files', {
  resolver: () => composer.FileTC.getResolver(RESOLVER_FIND_MANY),
  prepareArgs: {
    filter: (source) => ({
      _operators: {
        _id: {
          in: source.files
        }
      }
    })
  },
  projection: { files: 1 }
})

BannerTC.addRelation('bannerGroup', {
  resolver: () => composer.BannerGroupTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.bannerGroup
  },
  projection: { bannerGroup: 1 }
})


// CUSTOM_RESOLVER
const resolverFindMany = BannerTC.getResolver(RESOLVER_FIND_MANY)
const resolverCount = BannerTC.getResolver(RESOLVER_COUNT)

// CUSTOM HOOK

BannerTC.setResolver(
  RESOLVER_BANNER_FIND_MANY,
  resolverFindMany.addFilterArg({
    name: 'keyword',
    type: 'String',
    query: (rawQuery, value) => {
      rawQuery.name = stringHelper.regexMongooseKeyword(value)
    }
  })
)

BannerTC.setResolver(
  RESOLVER_BANNER_COUNT,
  resolverCount.addFilterArg({
    name: 'keyword',
    type: 'String',
    query: (rawQuery, value) => {
      rawQuery.name = stringHelper.regexMongooseKeyword(value)
    }
  })
)
export default BannerTC
