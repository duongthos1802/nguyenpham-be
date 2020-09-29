import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// options
import { customizationOptions } from '../customizationOptions'
// extensions
import { stringHelper } from '../../extensions'
// helpers
import { validateHelper } from '../../models/extensions'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
import {
  RESOLVER_COUNT,
  RESOLVER_FIND_MANY,
  RESOLVER_HTML_BLOCK_COUNT,
  RESOLVER_HTML_BLOCK_FIND_MANY,
  RESOLVER_UPDATE_ONE,
  RESOLVER_CREATE_ONE
} from '../../constants/resolver'
import { ERROR_MESSAGE } from '../../constants/errorCode'


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

// CUSTOM HOOK
HtmlBlockTC.wrapResolverResolve(RESOLVER_CREATE_ONE, (next) => async (rp) => {
  rp.beforeRecordMutate = async (doc, { source, args, context, info }) => {
    if (args && args.record) {
      const { record } = args

      // check duplicate code
      if (record.code) {
        const existCode = await validateHelper.checkExistField({
          fieldCheck: 'code',
          valueCheck: record.code,
          modelName: 'HtmlBlock',
          referenceId: null
        })

        if (existCode) {
          throw new ApolloError(
            ERROR_MESSAGE.CODE_EXIST.text,
            ERROR_MESSAGE.CODE_EXIST.extensionCode
          )
        }
      }
    }
    return doc
  }
  return next(rp)
})

HtmlBlockTC.wrapResolverResolve(RESOLVER_UPDATE_ONE, (next) => async (rp) => {
  rp.beforeRecordMutate = async (doc, { source, args, context, info }) => {
    if (!doc) {
      throw new ApolloError(
        ERROR_MESSAGE.NOT_FOUND.text,
        ERROR_MESSAGE.NOT_FOUND.extensionCode
      )
    }
    if (args && args.record) {
      const { record } = args

      // check duplicate code
      if (record.code) {
        const existCode = await validateHelper.checkExistField({
          fieldCheck: 'code',
          valueCheck: record.code,
          modelName: 'HtmlBlock',
          referenceId: doc._id
        })

        if (existCode) {
          throw new ApolloError(
            ERROR_MESSAGE.CODE_EXIST.text,
            ERROR_MESSAGE.CODE_EXIST.extensionCode
          )
        }
      }
    }
    return doc
  }
  return next(rp)
})

export default HtmlBlockTC