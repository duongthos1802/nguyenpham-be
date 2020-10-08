import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// composer
import composer from '../composer'
// constants
import {
  RESOLVER_COUNT,
  RESOLVER_FIND_BY_ID,
  RESOLVER_FIND_MANY,
  RESOLVER_RECIPE_COUNT,
  RESOLVER_RECIPE_FIND_MANY
} from '../../constants/resolver'
import { CACHE_EXPIRATION } from '../../constants/cache'
import { RecipeStatus } from './enum'
// options
import { customizationOptions } from '../customizationOptions'

export const RecipeTC = composeWithDataLoader(
  composeWithMongoose(models.Recipe, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

RecipeTC.addRelation('category', {
  resolver: () => composer.CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.category
  },
  projection: { category: 1 }
})

// CUSTOM RESOLVER
const resolverFindMany = RecipeTC.getResolver(RESOLVER_FIND_MANY)
const resolverCount = RecipeTC.getResolver(RESOLVER_COUNT)

RecipeTC.setResolver(
  RESOLVER_RECIPE_FIND_MANY,
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
      type: [RecipeStatus],
      query: (rawQuery, value) => {
        rawQuery.status = { $nin: value }
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

RecipeTC.setResolver(
  RESOLVER_RECIPE_COUNT,
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
      type: [RecipeStatus],
      query: (rawQuery, value) => {
        rawQuery.status = { $nin: value }
      }
    })
)

export default RecipeTC
