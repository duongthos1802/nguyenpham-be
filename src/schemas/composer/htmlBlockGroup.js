import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'
import HtmlBlockTC from './htmlBlock'
import { RESOLVER_HTML_BLOCK_FIND_MANY } from '../../constants/resolver'

export const HtmlBlockGroupTC = composeWithDataLoader(
  composeWithMongoose(models.HtmlBlockGroup, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

HtmlBlockGroupTC.addFields({
  htmlBlock: {
    type: [HtmlBlockTC],
    args: HtmlBlockTC.getResolver(RESOLVER_HTML_BLOCK_FIND_MANY).getArgs(),
    resolve: async (source, args, context, info) => {
      const rawQuery = {
        htmlBlockGroup: source._id
      }
      return HtmlBlockTC.getResolver(RESOLVER_HTML_BLOCK_FIND_MANY).resolve({
        source,
        args,
        context,
        info,
        rawQuery
      })
    }
  }
})


export default HtmlBlockGroupTC
