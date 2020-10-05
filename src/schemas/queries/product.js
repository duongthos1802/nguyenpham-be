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
  RESOLVER_COUNT,
  RESOLVER_PRODUCT_FIND_MANY,
  RESOLVER_FIND_ONE, RESOLVER_PRODUCT_COUNT
} from '../../constants/resolver'
import { PRODUCT_STATUS } from '../../constants/enum'
// extensions
import { stringHelper, dateTimeHelper } from '../../extensions'
import { FORMAT_DATE_EN, EUROPE_TIMEZONE } from '../../extensions/dateTime'
import { pageHelper, productHelper } from '../../models/extensions'

const ProductTC = composer.ProductTC

export default {
  product: ProductTC.getResolver(RESOLVER_FIND_BY_ID),
  products: ProductTC.getResolver(RESOLVER_FIND_MANY),
  productsConnection: ProductTC.getResolver(RESOLVER_CONNECTION),
  productsCount: ProductTC.getResolver(RESOLVER_PRODUCT_COUNT),
  productsPagination: ProductTC.getResolver(RESOLVER_PAGINATION),
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

        return configCategory

      } catch (error) {
        console.log('error...', error);
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
            aggregateClause.push({ $match: optionMatchClause })
          }
        }
        //search keyword
        if (keyword && keyword !== '') {
          optionMatchClause.name = stringHelper.regexMongooseKeyword(keyword)
          aggregateClause.push({ $match: optionMatchClause })
        }
        if (status && status !== '') {
          optionMatchClause.status = stringHelper.regexMongooseKeyword(status)
          aggregateClause.push({ $match: optionMatchClause })
        }
      }

      let sortByProduct = productHelper.getSortProduct(sortBy)
        sortByProduct = {
          ...sortByProduct
        }

      aggregateClause.push({ $sort: sortByProduct })

      //group items
      aggregateClause.push({
        $group: {
          _id: '$_id',
          items: { $last: '$$ROOT' }
        }
      })

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
}
