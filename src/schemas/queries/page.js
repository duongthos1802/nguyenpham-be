// composer
import composer from '../composer'
// constant
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT,
  RESOLVER_PAGE_COUNT,
  RESOLVER_PAGE_FIND_MANY
} from '../../constants/resolver'

const PageTC = composer.PageTC

export default {
  page: PageTC.getResolver(RESOLVER_FIND_BY_ID),
  pages: PageTC.getResolver(RESOLVER_PAGE_FIND_MANY),
  pagesConnection: PageTC.getResolver(RESOLVER_CONNECTION),
  pagesCount: PageTC.getResolver(RESOLVER_PAGE_COUNT),
  pagesPagination: PageTC.getResolver(RESOLVER_PAGINATION)
}
