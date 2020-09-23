import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const ProductTC = composer.ProductTC

export default {
  category: ProductTC.getResolver(RESOLVER_FIND_BY_ID),
  categories: ProductTC.getResolver(RESOLVER_FIND_MANY),
  categoriesConnection: ProductTC.getResolver(RESOLVER_CONNECTION),
  categoriesCount: ProductTC.getResolver(RESOLVER_COUNT),
  categoriesPagination: ProductTC.getResolver(RESOLVER_PAGINATION)
}
