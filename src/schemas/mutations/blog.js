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
  createBlog: BlogTC.getResolver(RESOLVER_CREATE_ONE),
  updateBlog: BlogTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyBlogs: BlogTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteBlog: BlogTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyBlogs: BlogTC.getResolver(RESOLVER_REMOVE_MANY)
}
