import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'
const BannerTC = composer.BannerTC

export default {
  createBanner: BannerTC.getResolver(RESOLVER_CREATE_ONE),
  updateBanner: BannerTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyBanners: BannerTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteBanner: BannerTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyBanners: BannerTC.getResolver(RESOLVER_REMOVE_MANY)
}
