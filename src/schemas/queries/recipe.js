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
  RESOLVER_COUNT, 
  RESOLVER_RECIPE_COUNT
} from '../../constants/resolver'
import { sortHelper } from '../../models/extensions'
import { stringHelper } from '../../extensions'

const RecipeTC = composer.RecipeTC

export default {
  recipe: RecipeTC.getResolver(RESOLVER_FIND_BY_ID),
  recipes: RecipeTC.getResolver(RESOLVER_FIND_MANY),
  recipesConnection: RecipeTC.getResolver(RESOLVER_CONNECTION),
  recipesCount: RecipeTC.getResolver(RESOLVER_RECIPE_COUNT),
  recipesPagination: RecipeTC.getResolver(RESOLVER_PAGINATION),
  searchRecipes: {
    type: composer.SearchRecipeTC,
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
      const searchRecipe = {
        total: 0,
        items: []
      }

      //group items
      aggregateClause.push({
        $group: {
          _id: '$_id',
          items: { $last: '$$ROOT' }
        }
      })

      if (where) {
        const {
          keyword,
          status,
          category,
          level
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
        }
        if (status && status !== '') {
          optionMatchClause.status = stringHelper.regexMongooseKeyword(status)
        }
        if (level && level !== '') {
          optionMatchClause.level = stringHelper.regexMongooseKeyword(level)
        }
      }

      if (Object.keys(optionMatchClause).length > 0) {
        aggregateClause.push({ $match: optionMatchClause })
      }

      aggregateClause.push({
        $group: {
          _id: null,
          count: { $sum: 1 },
          entries: { $push: '$items' }
        }
      })

      let sortByRecipe = sortHelper.getSortRecipe(sortBy)
        sortByRecipe = {
          ...sortByRecipe
        }

      aggregateClause.push({ $sort: sortByRecipe })

      aggregateClause.push({
        $project: {
          _id: 0,
          total: '$count',
          items: {
            $slice: ['$entries', skip || 0, first || 10]
          }
        }
      })
      const recipes = await models.Recipe.aggregate(aggregateClause)
      // find recipes with clauses
      if (!!recipes) {
        if (recipes.length > 0) {
          //list Recipe
          searchRecipe.total = recipes[0].total
          searchRecipe.items = recipes[0].items
        }
      }

      return searchRecipe
    }
  },
}
