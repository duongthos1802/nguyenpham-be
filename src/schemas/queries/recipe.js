import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const RecipeTC = composer.RecipeTC

export default {
  recipe: RecipeTC.getResolver(RESOLVER_FIND_BY_ID),
  recipes: RecipeTC.getResolver(RESOLVER_FIND_MANY),
  recipesConnection: RecipeTC.getResolver(RESOLVER_CONNECTION),
  recipesCount: RecipeTC.getResolver(RESOLVER_COUNT),
  recipesPagination: RecipeTC.getResolver(RESOLVER_PAGINATION)
}
