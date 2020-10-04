import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT,
  RESOLVER_PRODUCT_FIND_MANY
} from '../../constants/resolver'
import { pageHelper } from '../../models/extensions'
import {
  CATEGORY_FEATURE_COUNT,
  CATEGORY_NAME,
  PRODUCT_IN_CATEGORY_FEATURE_COUNT
} from '../../constants'
import { PRODUCT_STATUS } from '../../constants/enum'

const CategoryTC = composer.CategoryTC

export default {
  category: CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  categories: CategoryTC.getResolver(RESOLVER_FIND_MANY),
  categoriesConnection: CategoryTC.getResolver(RESOLVER_CONNECTION),
  categoriesCount: CategoryTC.getResolver(RESOLVER_COUNT),
  categoriesPagination: CategoryTC.getResolver(RESOLVER_PAGINATION),
  categoryFeatures: {
    type: [composer.CategoryFeatureTC],
    args: {
      orderBy: composer.ProductTC.getResolver(
        RESOLVER_PRODUCT_FIND_MANY
      ).getArgs().sort
    },
    resolve: async (_, args, context, info) => {
      // query
      try {
        // get config home page
        const config = await pageHelper.getConfigHomePage()

        const whereClause = {}
        if (config) {
          const {
            // configCategory,
            configCategorySecond,
            configCategoryThird,
            configCategoryFour
          } = config

          if (configCategorySecond || configCategoryThird) {
            let idWhereClause = []

            if (configCategorySecond && configCategorySecond.key) {
              idWhereClause.push(configCategorySecond.key)
            }
            if (configCategoryThird && configCategoryThird.key) {
              idWhereClause.push(configCategoryThird.key)
            }

            if (configCategoryFour && configCategoryFour.key) {
              idWhereClause.push(configCategoryFour.key)
            }

            whereClause._operators = {
              _id: {
                in: idWhereClause
              }
            }
          }
        }

        // 1. get first 2 category
        const categories = await CategoryTC.getResolver(
          RESOLVER_FIND_MANY
        ).resolve({
          args: {
            filter: whereClause,
            limit: CATEGORY_FEATURE_COUNT
          }
        })

        if (!categories || categories.length === 0) {
          return []
        }

        // 2. get category info
        let resultData = []

        await Promise.all(
          categories.map(async (category) => {
            // 2.1. get category name
            const productFilter = {
              OR: [
                {
                  status: null
                },
                {
                  status: PRODUCT_STATUS.PUBLISHED
                }
              ]
            }

            productFilter.category = category._id
            const categoryName = category.name
            const listProducts = await composer.ProductTC.getResolver(
              RESOLVER_PRODUCT_FIND_MANY
            ).resolve({
              args: {
                filter: productFilter,
                limit: PRODUCT_IN_CATEGORY_FEATURE_COUNT,
                sort: args.orderBy
              }
            })

            resultData.push({
              id: category._id,
              index: category.index,
              name: categoryName || null,
              image: category.image,
              slug: category.slug,
              products: listProducts
            })
          })
        )

        return resultData
      } catch (error) {
        throw new Error(error)
      }
    }
  },

}
