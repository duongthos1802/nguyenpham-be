// models
import models from '../../models'
// composer
import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT,
  RESOLVER_FIND_ONE
} from '../../constants/resolver'
import { sortHelper } from '../../models/extensions'
import { stringHelper } from '../../extensions'

const BlogTC = composer.BlogTC

export default {
  blog: BlogTC.getResolver(RESOLVER_FIND_BY_ID),
  blogs: BlogTC.getResolver(RESOLVER_FIND_MANY),
  blogsConnection: BlogTC.getResolver(RESOLVER_CONNECTION),
  blogsCount: BlogTC.getResolver(RESOLVER_COUNT),
  blogsPagination: BlogTC.getResolver(RESOLVER_PAGINATION),
  searchBlogs: {
    type: composer.SearchBlogTC,
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
      const searchBlog = {
        total: 0,
        items: []
      }


      if (where) {
        const {
          keyword,
          status
        } = where
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


      let sortByBlog = sortHelper.getSortBlog(sortBy)
      sortByBlog = {
        ...sortByBlog
      }

      aggregateClause.push({ $sort: sortByBlog })

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
      const blogs = await models.Blog.aggregate(aggregateClause)
      // find blogs with clauses
      if (!!blogs) {
        if (blogs.length > 0) {
          //list Blog
          searchBlog.total = blogs[0].total
          searchBlog.items = blogs[0].items
        }
      }

      return searchBlog
    }
  },

  categoriesBlogFeatures: {
    type: composer.SearchBlogFeaturesTC,
    args: {
      where: 'JSON'
    },
    resolve: async (_, { where }, context, info) => {
      try {

        const { _id, slug } = where

        const searchBlogFeatures = {
          blogFeatures: [],
          categoryBlog: []
        }

        if (slug) {
          const blogParent = await composer.CategoryTC.getResolver(
            RESOLVER_FIND_ONE
          ).resolve({
            args: {
              filter: {
                slug: slug,
                status: "Published"
              }
            }
          })
          if (blogParent && blogParent._id) {
            searchBlogFeatures.categoryBlog = await composer.CategoryTC.getResolver(
              RESOLVER_FIND_MANY
            ).resolve({
              args: {
                filter: {
                  parentId: blogParent._id,
                  status: "Published"
                }
              }
            })
          }
        }

        if (_id) {
          searchBlogFeatures.blogFeatures = await BlogTC.getResolver(
            RESOLVER_FIND_MANY
          ).resolve({
            args: {
              filter: {
                categoryId: _id,
                status: "Published"
              }
            }
          })
        }

        return searchBlogFeatures

      } catch (error) {

      }
    }
  }
}
