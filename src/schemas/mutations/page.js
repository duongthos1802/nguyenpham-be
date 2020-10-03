import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'
const PageTC = composer.PageTC

export default {
  createPage: PageTC.getResolver(RESOLVER_CREATE_ONE),
  updatePage: PageTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyPages: PageTC.getResolver(RESOLVER_UPDATE_MANY),
  deletePage: PageTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyPages: PageTC.getResolver(RESOLVER_REMOVE_MANY)
}
