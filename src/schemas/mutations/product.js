// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const ProductTC = composer.ProductTC

export default {
  createCategory: ProductTC.getResolver(RESOLVER_CREATE_ONE),
  updateCategory: ProductTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyCategories: ProductTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteCategory: ProductTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyCategories: ProductTC.getResolver(RESOLVER_REMOVE_MANY)
}
