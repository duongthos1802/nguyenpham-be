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
  RESOLVER_BANNER_COUNT,
  RESOLVER_FIND_ONE
} from '../../constants/resolver'
import { CATEGORY_STATUS } from '../../constants/enum'

const BannerTC = composer.BannerTC

export default {
  banner: BannerTC.getResolver(RESOLVER_FIND_BY_ID),
  banners: BannerTC.getResolver(RESOLVER_BANNER_FIND_MANY),
  bannersConnection: BannerTC.getResolver(RESOLVER_CONNECTION),
  bannersCount: BannerTC.getResolver(RESOLVER_BANNER_COUNT),
  bannersPagination: BannerTC.getResolver(RESOLVER_PAGINATION),
  bannerService: {
    type: composer.CategoryTC,
    args: {
      where: 'JSON'
    },
    resolve: async (_, { where }, context, info) => {
      const { slug } = where
      return await composer.CategoryTC.getResolver(
        RESOLVER_FIND_ONE
      ).resolve({
        args: {
          filter: {
            slug: slug,
            status: CATEGORY_STATUS.PUBLISHED
          }
        }
      })
    }
  }
}
