import mongoose from 'mongoose'
// models
import models from '../../models'
// composer
import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'
import { sortHelper } from '../../models/extensions'
import { stringHelper } from '../../extensions'

const VideoTC = composer.VideoTC

export default {
  video: VideoTC.getResolver(RESOLVER_FIND_BY_ID),
  videos: VideoTC.getResolver(RESOLVER_FIND_MANY),
  videosConnection: VideoTC.getResolver(RESOLVER_CONNECTION),
  videosCount: VideoTC.getResolver(RESOLVER_COUNT),
  videosPagination: VideoTC.getResolver(RESOLVER_PAGINATION),
  searchVideos: {
    type: composer.SearchVideoTC,
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
      const searchVideo = {
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
          optionMatchClause.title = stringHelper.regexMongooseKeyword(keyword)
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

      
      let sortByVideo = sortHelper.getSortVideo(sortBy)
        sortByVideo = {
          ...sortByVideo
        }

      aggregateClause.push({ $sort: sortByVideo })

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
      const videos = await models.Video.aggregate(aggregateClause)
      // find videos with clauses
      if (!!videos) {
        if (videos.length > 0) {
          //list Video
          searchVideo.total = videos[0].total
          searchVideo.items = videos[0].items
        }
      }

      return searchVideo
    }
  },
}
