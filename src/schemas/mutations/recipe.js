// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const RecipeTC = composer.RecipeTC

export default {
  createRecipe: RecipeTC.getResolver(RESOLVER_CREATE_ONE),
  updateRecipe: RecipeTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyRecipes: RecipeTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteRecipe: RecipeTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyRecipes: RecipeTC.getResolver(RESOLVER_REMOVE_MANY)
}
