// composer
import composer from '../composer'
// constant
import {
  RESOLVER_FIND_BY_ID,
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_ONE
} from '../../constants/resolver'
// helper
import { pageHelper } from '../../models/extensions'
import { CATEGORY_FEATURE_COUNT, PRODUCT_IN_CATEGORY_FEATURE_COUNT, RECIPE_IN_CATEGORY_FEATURE_COUNT } from '../../constants'
import CategoryTC from '../composer/category'
import { PRODUCT_STATUS, RECIPE_STATUS, CATEGORY_OPTION, CATEGORY_STATUS, EVENT_HOME_BY } from '../../constants/enum'

const getIdByVideo = (url) => {
  if (!url) return null
  const arrayStringUrl = url.split('=')
  const id = arrayStringUrl.slice(arrayStringUrl.length - 1, arrayStringUrl.length)
  return id
}

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
          urlVideo: null,
          eventRightActive: null,
          bannerGroup: null
        }
        // 1. get config home page
        const config = await pageHelper.getConfigHomePage()

        // if (!config && !config.configEventLeft && !config.configEventRight) {
        //   return null
        // }

        if (config) {

          const { configEventLeft, configEventRightVideo, configEventRightBanner, configEventRightActive } = config

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

          if (configEventRightActive) {
            event.eventRightActive = configEventRightActive

            // get Video by config
            if (configEventRightVideo && configEventRightActive === EVENT_HOME_BY.VIDEO) {
              event.urlVideo = configEventRightVideo
            }

            // get banner by config
            if (configEventRightBanner && configEventRightActive === EVENT_HOME_BY.BANNER) {
              event.bannerGroup = await composer.BannerGroupTC.getResolver(
                RESOLVER_FIND_BY_ID
              ).resolve({
                args: {
                  _id: config.configEventRightBanner.key
                }
              })
            }
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
        let idWhereClause = []
        if (config) {
          const {
            // configCategory,
            configCategorySecond,
            configCategoryThird,
            configCategoryFour
          } = config



          if (configCategorySecond || configCategoryThird || configCategoryFour) {

            if (configCategorySecond && configCategorySecond.key) {
              idWhereClause.push(configCategorySecond.key)
            }

            if (configCategoryThird && configCategoryThird.key) {
              idWhereClause.push(configCategoryThird.key)
            }

            if (configCategoryFour && configCategoryFour.key) {
              idWhereClause.push(configCategoryFour.key)
            }

          }
        }

        // 1. get first 2 category
        let categories = []
        let indexId = 0

        while (indexId < idWhereClause.length) {
          const cate = await CategoryTC.getResolver(
            RESOLVER_FIND_ONE
          ).resolve({
            args: {
              filter: {
                _id: idWhereClause[indexId]
              },
              status: CATEGORY_STATUS.PUBLISHED,
              limit: CATEGORY_FEATURE_COUNT,
            }
          })

          if (cate) {
            categories.push(cate)
          }
          indexId++
        }

        if (!categories || categories.length === 0) {
          return []
        }

        // 2. get category info
        let resultData = []
        let index = 0

        while (index < categories.length) {

          // 2.1. get category name
          let productFilter = {
            OR: [
              {
                status: PRODUCT_STATUS.PUBLISHED
              }
            ],
            isPriority: true
          }

          productFilter.category = categories[index]._id
          const categoryName = categories[index].name

          let listProducts = []
          let listRecipes = []

          if (categories[index].option === CATEGORY_OPTION.PRODUCT) {
            listProducts = await composer.ProductTC.getResolver(
              RESOLVER_FIND_MANY
            ).resolve({
              args: {
                filter: productFilter,
                limit: PRODUCT_IN_CATEGORY_FEATURE_COUNT,
                // sort: args.orderBy
              }
            })
          }

          if (categories[index] === CATEGORY_OPTION.RECIPE) {
            listRecipes = await composer.RecipeTC.getResolver(
              RESOLVER_FIND_MANY
            ).resolve({
              args: {
                filter: {
                  category: productFilter,
                  status: RECIPE_STATUS.PUBLISHED
                },
                limit: RECIPE_IN_CATEGORY_FEATURE_COUNT
              }
            })
          }

          resultData.push({
            _id: categories[index]._id,
            index: categories[index].index,
            name: categoryName || null,
            option: categories[index].option,
            image: categories[index].image,
            slug: categories[index].slug,
            products: listProducts,
            recipes: listRecipes
          })

          index++
        }

        return resultData
      } catch (error) {
        throw new Error(error)
      }
    }
  },
}
