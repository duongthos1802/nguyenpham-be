// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const BannerGroupTC = composer.BannerGroupTC

export default {
  createCategory: BannerGroupTC.getResolver(RESOLVER_CREATE_ONE),
  updateCategory: BannerGroupTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyCategories: BannerGroupTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteCategory: BannerGroupTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyCategories: BannerGroupTC.getResolver(RESOLVER_REMOVE_MANY)
}
