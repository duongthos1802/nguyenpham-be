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
  createProduct: ProductTC.getResolver(RESOLVER_CREATE_ONE),
  updateProduct: ProductTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyProducts: ProductTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteProduct: ProductTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyProducts: ProductTC.getResolver(RESOLVER_REMOVE_MANY)
}
