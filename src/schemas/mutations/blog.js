// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const BlogTC = composer.BlogTC

export default {
  createCategory: BlogTC.getResolver(RESOLVER_CREATE_ONE),
  updateCategory: BlogTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyCategories: BlogTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteCategory: BlogTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyCategories: BlogTC.getResolver(RESOLVER_REMOVE_MANY)
}
