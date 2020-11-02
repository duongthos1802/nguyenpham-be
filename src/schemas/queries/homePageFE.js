// composer
import composer from '../composer'
// constant
import {
  RESOLVER_FIND_BY_ID,
  RESOLVER_FIND_MANY
} from '../../constants/resolver'
// helper
import { pageHelper } from '../../models/extensions'
import { CATEGORY_FEATURE_COUNT, PRODUCT_IN_CATEGORY_FEATURE_COUNT, RECIPE_IN_CATEGORY_FEATURE_COUNT } from '../../constants'
import CategoryTC from '../composer/category'
import { PRODUCT_STATUS, RECIPE_STATUS, CATEGORY_OPTION, CATEGORY_STATUS } from '../../constants/enum'


export default {
  getBannerHomePage: {
    type: composer.BannerGroupTC,
    args: {
      where: 'JSON'
    },
    resolve: async (_, { where }, context, info) => {
      // query
      try {
        // 1. get config home page
        const config = await pageHelper.getConfigHomePage()

        if (!config || !config.configBanner) {
          return null
        }

        // 2. get banner by config
        return await composer.BannerGroupTC.getResolver(
          RESOLVER_FIND_BY_ID
        ).resolve({
          args: {
            _id: config.configBanner.key
          }
        })
      } catch (error) {
        throw new Error(error)
      }
    }
  },

  getServiceHomePage: {
    type: composer.HtmlBlockGroupTC,
    args: {
      where: 'JSON'
    },
    resolve: async (_, { where }, context, info) => {
      // query
      try {
        // 1. get config home page
        const config = await pageHelper.getConfigHomePage()

        if (!config || !config.configService) {
          return null
        }

        // 2. get service by config
        return await composer.HtmlBlockGroupTC.getResolver(
          RESOLVER_FIND_BY_ID
        ).resolve({
          args: {
            _id: config.configService.key
          }
        })
      } catch (error) {
        throw new Error(error)
      }
    }
  },

  getEventHomePage: {
    type: composer.EventHomeTC,
    args: {
      where: 'JSON'
    },
    resolve: async (_, { where }, context, info) => {
      // query
      try {
        const event = {
          eventLeft: null,
          eventRight: null
        }
        // 1. get config home page
        const config = await pageHelper.getConfigHomePage()

        // if (!config && !config.configEventLeft && !config.configEventRight) {
        //   return null
        // }

        if (config) {

          const { configEventLeft, configEventRight } = config

          // 2. get event by config
          // let eventLeft = null
          if (configEventLeft) {
            event.eventLeft = await composer.HtmlBlockGroupTC.getResolver(
              RESOLVER_FIND_BY_ID
            ).resolve({
              args: {
                _id: configEventLeft.key
              }
            })
          }

          if (configEventRight) {
            event.eventRight = await composer.HtmlBlockGroupTC.getResolver(
              RESOLVER_FIND_BY_ID
            ).resolve({
              args: {
                _id: configEventRight.key
              }
            })
          }

        }

        return event

      } catch (error) {
        throw new Error(error)
      }
    }
  },
  categoryFeatures: {
    type: [composer.CategoryFeatureTC],
    args: {

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
            status: CATEGORY_STATUS.PUBLISHED,
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
              status: PRODUCT_STATUS.PUBLISHED
            }

            productFilter.category = category._id
            const categoryName = category.name

            let listProducts = []
            let listRecipes = []

            if (category.option === CATEGORY_OPTION.PRODUCT) {
              listProducts = await composer.ProductTC.getResolver(
                RESOLVER_FIND_MANY
              ).resolve({
                args: {
                  filter: {
                    category: category._id,
                    status: PRODUCT_STATUS.PUBLISHED
                  },
                  limit: PRODUCT_IN_CATEGORY_FEATURE_COUNT,
                  // sort: args.orderBy
                }
              })
            }

            if (category.option === CATEGORY_OPTION.RECIPE) {
              listRecipes = await composer.RecipeTC.getResolver(
                RESOLVER_FIND_MANY
              ).resolve({
                args: {
                  filter: {
                    category: category._id,
                    status: RECIPE_STATUS.PUBLISHED
                  },
                  limit: RECIPE_IN_CATEGORY_FEATURE_COUNT,
                  sort: args.orderBy
                }
              })
            }

            resultData.push({
              _id: category._id,
              index: category.index,
              name: categoryName || null,
              option: category.option,
              image: category.image,
              slug: category.slug,
              products: listProducts,
              recipes: listRecipes
            })
          })
        )

        return resultData
      } catch (error) {

        console.log('error....', error);
        throw new Error(error)
      }
    }
  },
}
