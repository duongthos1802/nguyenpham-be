import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const CategoryTC = composer.CategoryTC

export default {
  category: CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  categories: CategoryTC.getResolver(RESOLVER_FIND_MANY),
  categoriesConnection: CategoryTC.getResolver(RESOLVER_CONNECTION),
  categoriesCount: CategoryTC.getResolver(RESOLVER_COUNT),
  categoriesPagination: CategoryTC.getResolver(RESOLVER_PAGINATION)
}
