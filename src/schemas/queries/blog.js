import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const BlogTC = composer.BlogTC

export default {
  category: BlogTC.getResolver(RESOLVER_FIND_BY_ID),
  categories: BlogTC.getResolver(RESOLVER_FIND_MANY),
  categoriesConnection: BlogTC.getResolver(RESOLVER_CONNECTION),
  categoriesCount: BlogTC.getResolver(RESOLVER_COUNT),
  categoriesPagination: BlogTC.getResolver(RESOLVER_PAGINATION)
}
