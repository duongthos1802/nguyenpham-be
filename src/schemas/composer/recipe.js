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
import { RESOLVER_FIND_BY_ID } from '../../constants/resolver'

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

export default RecipeTC
