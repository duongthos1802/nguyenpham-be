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
  createBannerGroup: BannerGroupTC.getResolver(RESOLVER_CREATE_ONE),
  updateBannerGroup: BannerGroupTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyBannerGroups: BannerGroupTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteBannerGroup: BannerGroupTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyBannerGroups: BannerGroupTC.getResolver(RESOLVER_REMOVE_MANY)
}
