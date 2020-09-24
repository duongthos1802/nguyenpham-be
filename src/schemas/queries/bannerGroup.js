import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const BannerGroupTC = composer.BannerGroupTC

export default {
  category: BannerGroupTC.getResolver(RESOLVER_FIND_BY_ID),
  categories: BannerGroupTC.getResolver(RESOLVER_FIND_MANY),
  categoriesConnection: BannerGroupTC.getResolver(RESOLVER_CONNECTION),
  categoriesCount: BannerGroupTC.getResolver(RESOLVER_COUNT),
  categoriesPagination: BannerGroupTC.getResolver(RESOLVER_PAGINATION)
}
