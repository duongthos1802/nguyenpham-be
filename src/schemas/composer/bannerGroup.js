import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'
import BannerTC from './banner'
import { RESOLVER_BANNER_FIND_MANY } from '../../constants/resolver'

export const BannerGroupTC = composeWithDataLoader(
  composeWithMongoose(models.BannerGroup, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

BannerGroupTC.addFields({
  banner: {
    type: [BannerTC],
    args: BannerTC.getResolver(RESOLVER_BANNER_FIND_MANY).getArgs(),
    resolve: async (source, args, context, info) => {
      const rawQuery = {
        bannerGroup: source._id
      }
      return BannerTC.getResolver(RESOLVER_BANNER_FIND_MANY).resolve({
        source,
        args,
        context,
        info,
        rawQuery
      })
    }
  }
})


export default BannerGroupTC
