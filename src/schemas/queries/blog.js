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
  blog: BlogTC.getResolver(RESOLVER_FIND_BY_ID),
  blogs: BlogTC.getResolver(RESOLVER_FIND_MANY),
  blogsConnection: BlogTC.getResolver(RESOLVER_CONNECTION),
  blogsCount: BlogTC.getResolver(RESOLVER_COUNT),
  blogsPagination: BlogTC.getResolver(RESOLVER_PAGINATION)
}
