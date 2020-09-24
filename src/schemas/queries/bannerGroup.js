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
  bannerGroup: BannerGroupTC.getResolver(RESOLVER_FIND_BY_ID),
  bannerGroups: BannerGroupTC.getResolver(RESOLVER_FIND_MANY),
  bannerGroupsConnection: BannerGroupTC.getResolver(RESOLVER_CONNECTION),
  bannerGroupsCount: BannerGroupTC.getResolver(RESOLVER_COUNT),
  bannerGroupsPagination: BannerGroupTC.getResolver(RESOLVER_PAGINATION)
}
