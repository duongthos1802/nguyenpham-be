import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT,
  RESOLVER_PRODUCT_FIND_MANY,
  RESOLVER_FIND_ONE
} from '../../constants/resolver'
import { stringHelper, dateTimeHelper } from '../../extensions'
import { PRODUCT_STATUS } from '../../constants/enum'
import { FORMAT_DATE_EN, EUROPE_TIMEZONE } from '../../extensions/dateTime'
import { pageHelper } from '../../models/extensions'

const ProductTC = composer.ProductTC

export default {
  product: ProductTC.getResolver(RESOLVER_FIND_BY_ID),
  products: ProductTC.getResolver(RESOLVER_FIND_MANY),
  productsConnection: ProductTC.getResolver(RESOLVER_CONNECTION),
  productsCount: ProductTC.getResolver(RESOLVER_COUNT),
  productsPagination: ProductTC.getResolver(RESOLVER_PAGINATION),
  // trendingProduct: {
  //   type: [ProductTC],
  //   args: {
  //     where: 'JSON!',
  //     limit: 'Int',
  //     sort: ProductTC.getResolver(RESOLVER_PRODUCT_FIND_MANY).getArgs().sort
  //   },
  //   resolve: async (_, { where, limit, sort }, context, info) => {
  //     // query
  //     try {
  //       const { _id } = where
  //       // 1. find category by id
  //       const category = await composer.CategoryTC.getResolver(
  //         RESOLVER_FIND_ONE
  //       ).resolve({
  //         args: {
  //           filter: {
  //             _id: _id
  //           }
  //         }
  //       })

  //       if (!category) {
  //         return []
  //       }

  //       // 2. query product by category
  //       return await ProductTC.getResolver(RESOLVER_PRODUCT_FIND_MANY).resolve({
  //         args: {
  //           filter: {
  //             category: category._id,
  //             status_not_in: [PRODUCT_STATUS.DELETED, PRODUCT_STATUS.SUSPENDED]
  //           },
  //           limit: limit,
  //           sort: sort
  //         }
  //       })
  //     } catch (error) {
  //       throw new Error(error)
  //     }
  //   }
  // }

  trendingItems: {
    type: composer.CategoryTC,
    resolve: async (_, args, context, info) => {
      // query
      try {
        // get config home page
        const config = await pageHelper.getConfigHomePage()

        if (!config || !config.configCategory) {
          return null
        }

        // 1. get first category
        const configCategory = await composer.CategoryTC.getResolver(
          RESOLVER_FIND_BY_ID
        ).resolve({
          args: {
            _id: config.configCategory.key
          }
        })

        console.log('configCategory....', configCategory)

        return configCategory

      } catch (error) {
        console.log('error...', error);
        throw new Error(error)
      }
    }
  },
}
