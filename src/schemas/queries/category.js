// models
import models from '../../models'
// composer
import composer from '../composer'
// constants
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT,
  RESOLVER_PRODUCT_FIND_MANY,
  RESOLVER_FIND_ONE
} from '../../constants/resolver'
import {
  CATEGORY_FEATURE_COUNT,
  CATEGORY_NAME,
  PRODUCT_IN_CATEGORY_FEATURE_COUNT
} from '../../constants'
import { CATEGORY_OPTION, PRODUCT_STATUS } from '../../constants/enum'
// extensions
import { pageHelper, sortHelper } from '../../models/extensions'
import { stringHelper } from '../../extensions'

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

  searchCategories: {
    type: composer.SearchCategoryTC,
    args: {
      where: 'JSON',
      skip: 'Int',
      first: 'Int',
      sortBy: 'String'
    },
    resolve: async (_, { skip, first, where, sortBy }, context, info) => {
      // try {
      let optionMatchClause = {}
      let aggregateClause = []
      const searchCategory = {
        total: 0,
        items: []
      }

      if (where) {
        const {
          keyword,
          status,
          option
        } = where
        //search keyword
        if (keyword && keyword !== '') {
          optionMatchClause.name = stringHelper.regexMongooseKeyword(keyword)
        }
        if (status && status !== '') {
          optionMatchClause.status = stringHelper.regexMongooseKeyword(status)
        }
        if (option) {
          if (option === CATEGORY_OPTION.RECIPE) {
            optionMatchClause.option = CATEGORY_OPTION.RECIPE
          }
          if (option === CATEGORY_OPTION.PRODUCT) {
            optionMatchClause.option = CATEGORY_OPTION.PRODUCT
          }
        }
      }

      if (Object.keys(optionMatchClause).length > 0) {
        aggregateClause.push({ $match: optionMatchClause })
      }


      //group items
      aggregateClause.push({
        $group: {
          _id: '$_id',
          items: { $last: '$$ROOT' }
        }
      })


      let sortByCategory = sortHelper.getSortCategory(sortBy)
      sortByCategory = {
        ...sortByCategory
      }

      aggregateClause.push({ $sort: sortByCategory })

      aggregateClause.push({
        $group: {
          _id: null,
          count: { $sum: 1 },
          entries: { $push: '$items' }
        }
      })

      aggregateClause.push({
        $project: {
          _id: 0,
          total: '$count',
          items: {
            $slice: ['$entries', skip || 0, first || 10]
          }
        }
      })
      const categories = await models.Category.aggregate(aggregateClause)
      // find categories with clauses
      if (!!categories) {
        if (categories.length > 0) {
          //list Category
          searchCategory.total = categories[0].total
          searchCategory.items = categories[0].items
        }
      }

      return searchCategory
    }
  },

  // cate recipe level 1
  searchCategoriesBySlug: {
    type: composer.RecipeCustomTC,
    args: { where: 'JSON' },
    resolve: async (_, { where }, context, info) => {
      try {
        const { slug, _id } = where
        let category = null
        let categories = []

        category = await CategoryTC.getResolver(
          RESOLVER_FIND_ONE
        ).resolve({
          args: {
            filter: {
              slug: slug,
              status: "Published"
            }
          }
        })

        if (category && category._id) {
          categories = await CategoryTC.getResolver(
            RESOLVER_FIND_MANY
          ).resolve({
            args: {
              filter: {
                parentId: category._id,
                status: "Published"
              }
            }
          })
        }

        return {
          category,
          categories
        }

      } catch (error) {

      }
    }
  },

  // cate recipe level 2
  searchCategoriesRecipe: {
    type: composer.RecipeCustomTC,
    args: { where: 'JSON' },
    resolve: async (_, { where }, context, info) => {
      try {
        const { slug, _id } = where
        let category = null
        let categories = []

        if (_id) {
          category = await CategoryTC.getResolver(
            RESOLVER_FIND_BY_ID
          ).resolve({
            args: {
              _id: _id,
              status: "Published"
            }
          })
        }


        if (slug) {
          const categoriesRecipe = await CategoryTC.getResolver(
            RESOLVER_FIND_ONE
          ).resolve({
            args: {
              filter: {
                slug: slug,
                status: "Published"
              }
            }
          })

          if (categoriesRecipe && categoriesRecipe._id) {
            categories = await CategoryTC.getResolver(
              RESOLVER_FIND_MANY
            ).resolve({
              args: {
                filter: {
                  parentId: categoriesRecipe._id,
                  status: "Published"
                }
              }
            })
          }
        }

        return {
          category,
          categories
        }

      } catch (error) {

      }
    }
  },

  searchChildrenCategories: {
    type: [composer.CategoryTC],
    args: {
      where: 'JSON',
      sortBy: 'String'
    },
    resolve: async (_, { where, sortBy }, context, info) => {

      try {
        const { parentId } = where
        if (parentId) {
          return await CategoryTC.getResolver(
            RESOLVER_FIND_MANY
          ).resolve({
            args: {
              filter: {
                parentId: parentId
              }
            }
          })
        }
        return []

      } catch (error) {
        console.log('error....', error);
      }

    }
  }
}
