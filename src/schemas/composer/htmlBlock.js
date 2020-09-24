import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// options
import { customizationOptions } from '../customizationOptions'
// extensions
import { stringHelper } from '../../extension'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
import { 
  RESOLVER_COUNT, 
  RESOLVER_FIND_MANY, 
  RESOLVER_HTML_BLOCK_COUNT, 
  RESOLVER_HTML_BLOCK_FIND_MANY 
} from '../../constants/resolver'

export const HtmlBlockTC = composeWithDataLoader(
  composeWithMongoose(models.HtmlBlock, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

// CUSTOM RESOLVER
const resolverFindMany = HtmlBlockTC.getResolver(RESOLVER_FIND_MANY)
const resolverCount = HtmlBlockTC.getResolver(RESOLVER_COUNT)

HtmlBlockTC.setResolver(
  RESOLVER_HTML_BLOCK_FIND_MANY,
  resolverFindMany
    .addFilterArg({
      name: 'keyword',
      type: 'String',
      query: (rawQuery, value) => {
        rawQuery.code = stringHelper.regexMongooseKeyword(value)
      }
    })
    .addSortArg({
      name: 'code_DESC',
      value: () => ({
        code: -1
      })
    })
    .addSortArg({
      name: 'code_ASC',
      value: () => ({
        code: 1
      })
    })
)

HtmlBlockTC.setResolver(
  RESOLVER_HTML_BLOCK_COUNT,
  resolverCount.addFilterArg({
    name: 'keyword',
    type: 'String',
    query: (rawQuery, value) => {
      rawQuery.code = stringHelper.regexMongooseKeyword(value)
    }
  })
)


export default HtmlBlockTC
