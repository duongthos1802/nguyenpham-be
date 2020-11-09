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
  RESOLVER_FIND_ONE
} from '../../constants/resolver'

import { CategoryOption } from '../composer/enum'
import { CATEGORY_OPTION, CATEGORY_STATUS, RECIPE_STATUS } from '../../constants/enum'
// extensions
import { sortHelper } from '../../models/extensions'
import { stringHelper } from '../../extensions'

const CategoryTC = composer.CategoryTC

export default {
  category: CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  categories: CategoryTC.getResolver(RESOLVER_FIND_MANY),
  categoriesConnection: CategoryTC.getResolver(RESOLVER_CONNECTION),
  categoriesCount: CategoryTC.getResolver(RESOLVER_COUNT),
  categoriesPagination: CategoryTC.getResolver(RESOLVER_PAGINATION),

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
          if (option === CATEGORY_OPTION.BLOG) {
            optionMatchClause.option = CATEGORY_OPTION.BLOG
          }
          if (option === CATEGORY_OPTION.VIDEO) {
            optionMatchClause.option = CATEGORY_OPTION.VIDEO
          }
          if (option === CATEGORY_OPTION.SERVICE) {
            optionMatchClause.option = CATEGORY_OPTION.SERVICE
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
        const {
          slug,
          limit,
          skip
        } = where
        let category = null
        let categories = []
        let recipes = []
        let total = 0

        category = await CategoryTC.getResolver(
          RESOLVER_FIND_ONE
        ).resolve({
          args: {
            filter: {
              slug: slug,
              status: CATEGORY_STATUS.PUBLISHED
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
                status: CATEGORY_STATUS.PUBLISHED
              }
            }
          })

          recipes = await composer.RecipeTC.getResolver(
            RESOLVER_FIND_MANY
          ).resolve({
            args: {
              filter: {
                status: CATEGORY_STATUS.PUBLISHED
              },
              limit: limit || 9,
              skip: skip || 0
            }
          })

          total = await composer.RecipeTC.getResolver(
            RESOLVER_COUNT
          ).resolve({
            args: {
              filter: {
                status: RECIPE_STATUS.PUBLISHED
              }
            }
          })

        }

        return {
          category,
          categories,
          recipes,
          total
        }

      } catch (error) {
        throw new Error(error)
      }
    }
  },

  // cate recipe level 2
  searchCategoriesRecipe: {
    type: composer.RecipeCustomTC,
    args: { where: 'JSON' },
    resolve: async (_, { where }, context, info) => {
      try {
        const {
          slug,
          _id,
          limit,
          skip
        } = where
        let category = null
        let categories = []
        let recipes = []
        let total = 0

        if (_id) {
          category = await CategoryTC.getResolver(
            RESOLVER_FIND_BY_ID
          ).resolve({
            args: {
              _id: _id,
              status: CATEGORY_STATUS.PUBLISHED
            }
          })
          recipes = await composer.RecipeTC.getResolver(
            RESOLVER_FIND_MANY
          ).resolve({
            args: {
              filter: {
                category: _id,
                status: RECIPE_STATUS.PUBLISHED
              },
              limit: limit || 10,
              skip: skip || 0
            }
          })
          total = await composer.RecipeTC.getResolver(
            RESOLVER_COUNT
          ).resolve({
            args: {
              filter: {
                category: _id,
                status: RECIPE_STATUS.PUBLISHED
              }
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
                status: CATEGORY_STATUS.PUBLISHED
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
                  status: CATEGORY_STATUS.PUBLISHED
                }
              }
            })
          }
        }

        return {
          category,
          categories,
          recipes,
          total
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
        throw new Error(error)
      }

    }
  },

  serachCategoryByOption: {
    type: CategoryTC,
    args: {
      option: CategoryOption,
    },
    resolve: async (_, { option }, context, info) => {
      try {

        const category = await CategoryTC.getResolver(
          RESOLVER_FIND_ONE
        ).resolve({
          args: {
            filter: {
              option: option
            }
          }
        })
        if (!category) {
          throw Error('NOT FIND ANY CATEGORY')
        }

        return category

      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
