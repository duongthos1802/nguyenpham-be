import mongoose from 'mongoose'
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
  RESOLVER_PRODUCT_COUNT,
  RESOLVER_FIND_ONE, RESOLVER_COUNT
} from '../../constants/resolver'
// extensions
import { stringHelper } from '../../extensions'
import { pageHelper, sortHelper } from '../../models/extensions'

const ProductTC = composer.ProductTC

export default {
  product: ProductTC.getResolver(RESOLVER_FIND_BY_ID),
  products: ProductTC.getResolver(RESOLVER_FIND_MANY),
  productsConnection: ProductTC.getResolver(RESOLVER_CONNECTION),
  productsCount: ProductTC.getResolver(RESOLVER_PRODUCT_COUNT),
  productsPagination: ProductTC.getResolver(RESOLVER_PAGINATION),
  trendingItems: {
    type: composer.TrendingTC,
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

        let cateParent = null
        let isParent = false
        while (!isParent) {
          if (configCategory && configCategory.parentId) {
            const category = await composer.CategoryTC.getResolver(
              RESOLVER_FIND_BY_ID
            ).resolve({
              args: {
                _id: configCategory.parentId
              }
            })
            if (category && !category.parentId) {
              isParent = true
              cateParent = category
            }
          } else {
            isParent = true
            cateParent = configCategory
          }
        }

        return {
          category: configCategory,
          option: cateParent
        }

      } catch (error) {
        console.log('eror', error)
        throw new Error(error)
      }
    }
  },
  searchProducts: {
    type: composer.SearchProductTC,
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
      const searchProduct = {
        total: 0,
        items: []
      }

      if (where) {
        const {
          keyword,
          status,
          category
        } = where
        // search by categoryId
        if (category) {
          //get category
          const cat = await models.Category.findOne({
            _id: mongoose.Types.ObjectId(category)
          }).exec()
          if (cat !== null) {
            optionMatchClause.category = cat._id
          }
        }
        //search keyword
        if (keyword && keyword !== '') {
          optionMatchClause.name = stringHelper.regexMongooseKeyword(keyword)
        }
        if (status && status !== '') {
          optionMatchClause.status = stringHelper.regexMongooseKeyword(status)
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

      let sortByProduct = sortHelper.getSortProduct(sortBy)
      sortByProduct = {
        ...sortByProduct
      }

      aggregateClause.push({ $sort: sortByProduct })

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
      const products = await models.Product.aggregate(aggregateClause)
      // find products with clauses
      if (!!products) {
        if (products.length > 0) {
          //list product
          searchProduct.total = products[0].total
          searchProduct.items = products[0].items
        }
      }

      return searchProduct
    }
  },

  // get product level 1
  searchProductsBySlug: {
    type: composer.ProductCustomTC,
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
        let products = []
        let total = 0

        category = await composer.CategoryTC.getResolver(
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
          categories = await composer.CategoryTC.getResolver(
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

        products = await ProductTC.getResolver(
          RESOLVER_FIND_MANY
        ).resolve({
          args: {
            filter: {
              status: "Published"
            },
            limit: limit || 9,
            skip: skip || 0
          }
        })

        total = await ProductTC.getResolver(
          RESOLVER_COUNT
        ).resolve({
          args: {
            filter: {
              status: "Published"
            }
          }
        })

        return {
          category,
          categories,
          products,
          total
        }

      } catch (error) {

      }
    }
  },

  // get Product > level 1
  searchProductsBySlugId: {
    type: composer.ProductCustomTC,
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
        let products = []
        let total = 0

        if (_id) {
          category = await composer.CategoryTC.getResolver(
            RESOLVER_FIND_BY_ID
          ).resolve({
            args: {
              _id: _id,
              status: "Published"
            }
          })
          products = await composer.ProductTC.getResolver(
            RESOLVER_FIND_MANY
          ).resolve({
            args: {
              filter: {
                category: _id
              },
              limit: limit || 9,
              skip: skip || 0
            }
          })
          total = await composer.ProductTC.getResolver(
            RESOLVER_COUNT
          ).resolve({
            args: {
              filter:{
                category: _id
              }
            }
          })
        }

        if (slug) {
          const categoriesProduct = await composer.CategoryTC.getResolver(
            RESOLVER_FIND_ONE
          ).resolve({
            args: {
              filter: {
                slug: slug,
                status: "Published"
              }
            }
          })

          if (categoriesProduct && categoriesProduct._id) {
            categories = await composer.CategoryTC.getResolver(
              RESOLVER_FIND_MANY
            ).resolve({
              args: {
                filter: {
                  parentId: categoriesProduct._id,
                  status: "Published"
                }
              }
            })
          }
        }

        return {
          category,
          categories,
          products,
          total
        }

      } catch (error) {
        throw new Error(error)
      }
    }
  },
}
