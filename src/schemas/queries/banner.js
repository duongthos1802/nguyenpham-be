// composer
import composer from '../composer'
// constant
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT,
  RESOLVER_BANNER_FIND_MANY,
  RESOLVER_BANNER_COUNT
} from '../../constants/resolver'

const BannerTC = composer.BannerTC

export default {
  banner: BannerTC.getResolver(RESOLVER_FIND_BY_ID),
  banners: BannerTC.getResolver(RESOLVER_BANNER_FIND_MANY),
  bannersConnection: BannerTC.getResolver(RESOLVER_CONNECTION),
  bannersCount: BannerTC.getResolver(RESOLVER_BANNER_COUNT),
  bannersPagination: BannerTC.getResolver(RESOLVER_PAGINATION)
}
