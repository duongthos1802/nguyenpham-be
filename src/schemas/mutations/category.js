// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const CategoryTC = composer.CategoryTC

export default {
  createCategory: CategoryTC.getResolver(RESOLVER_CREATE_ONE),
  updateCategory: CategoryTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyCategories: CategoryTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteCategory: CategoryTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyCategories: CategoryTC.getResolver(RESOLVER_REMOVE_MANY)
}
