import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from '../../vendor/graphql-compose-dataloader'
// models
import models from '../../models'
// constants
import { CACHE_EXPIRATION } from '../../constants/cache'
// options
import { customizationOptions } from '../customizationOptions'
import { RESOLVER_PRODUCT_FIND_MANY, RESOLVER_FIND_BY_ID, RESOLVER_CATEGORY_FIND_MANY, RESOLVER_FIND_MANY, RESOLVER_COUNT, RESOLVER_CATEGORY_COUNT, RESOLVER_RECIPE_FIND_MANY, RESOLVER_BLOG_FIND_MANY } from '../../constants/resolver'
import { ProductTC } from './product'
import { BlogTC } from './blog'
// composer
import composer from '../composer'
import RecipeTC from './recipe'

export const CategoryTC = composeWithDataLoader(
  composeWithMongoose(models.Category, customizationOptions),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

CategoryTC.addRelation('parentId', {
  resolver: () => composer.CategoryTC.getResolver(RESOLVER_FIND_BY_ID),
  prepareArgs: {
    _id: (source) => source.parentId
  },
  projection: { category: 1 }
})

CategoryTC.addFields({
  products: {
    type: [ProductTC],
    args: ProductTC.getResolver(RESOLVER_PRODUCT_FIND_MANY).getArgs(),
    resolve: (source, args, context, info) => {
      return ProductTC.getResolver(RESOLVER_PRODUCT_FIND_MANY).resolve({
        source,
        args,
        context,
        info,
        rawQuery: {
          category: source._id
        }
      })
    }
  }
})

CategoryTC.addFields({
  products: {
    type: [BlogTC],
    args: BlogTC.getResolver(RESOLVER_BLOG_FIND_MANY).getArgs(),
    resolve: (source, args, context, info) => {
      return BlogTC.getResolver(RESOLVER_BLOG_FIND_MANY).resolve({
        source,
        args,
        context,
        info,
        rawQuery: {
          category: source._id
        }
      })
    }
  }
})


CategoryTC.addFields({
  recipes: {
    type: [RecipeTC],
    args: RecipeTC.getResolver(RESOLVER_RECIPE_FIND_MANY).getArgs(),
    resolve: (source, args, context, info) => {
      return RecipeTC.getResolver(RESOLVER_RECIPE_FIND_MANY).resolve({
        source,
        args,
        context,
        info,
        rawQuery: {
          category: source._id
        }
      })
    }
  }
})

// CUSTOM RESOLVER
const resolverFindMany = CategoryTC.getResolver(RESOLVER_FIND_MANY)
const resolverCount = CategoryTC.getResolver(RESOLVER_COUNT)

CategoryTC.setResolver(
  RESOLVER_CATEGORY_FIND_MANY,
  resolverFindMany
    .addFilterArg({
      name: 'keyword',
      type: 'String',
      query: (rawQuery, value) => {
        rawQuery.name = stringHelper.regexMongooseKeyword(value)
      }
    })
    .addSortArg({
      name: 'index_DESC',
      value: () => ({
        index: -1
      })
    })
    .addSortArg({
      name: 'index_ASC',
      value: () => ({
        index: 1
      })
    })
    .addSortArg({
      name: 'priority_ASC',
      value: () => ({
        priority: 1
      })
    })
)

CategoryTC.setResolver(
  RESOLVER_CATEGORY_COUNT,
  resolverCount.addFilterArg({
    name: 'keyword',
    type: 'String',
    query: (rawQuery, value) => {
      rawQuery.name = stringHelper.regexMongooseKeyword(value)
    }
  })
)

// HOOK
// CategoryTC.wrapResolverResolve(RESOLVER_CREATE_ONE, (next) => async (rp) => {
//   rp.beforeRecordMutate = async (doc, { source, args, context, info }) => {
//     if (args && args.record) {
//       const { record } = args
//       // check duplicate name
//       if (record.name) {
//         const existName = await validateHelper.checkExistField({
//           fieldCheck: 'name',
//           valueCheck: record.name,
//           modelName: 'Category',
//           referenceId: null
//         })
//         if (existName) {
//           throw new ApolloError(
//             ERROR_MESSAGE.NAME_EXISTS.text,
//             ERROR_MESSAGE.NAME_EXISTS.extensionCode
//           )
//         }
//       }
//       // check duplicate slug
//       if (record.slug) {
//         const existSlug = await validateHelper.checkExistField({
//           fieldCheck: 'slug',
//           valueCheck: record.slug,
//           modelName: 'Category',
//           referenceId: null
//         })

//         if (existSlug) {
//           throw new ApolloError(
//             ERROR_MESSAGE.SLUG_EXISTS.text,
//             ERROR_MESSAGE.SLUG_EXISTS.extensionCode
//           )
//         }
//       }
//     }
//     return doc
//   }
//   return next(rp)
// })

// CategoryTC.wrapResolverResolve(RESOLVER_UPDATE_BY_ID, (next) => async (rp) => {
//   rp.beforeRecordMutate = async (doc, { source, args, context, info }) => {
//     if (args) {
//       const { record } = args
//       // check duplicate name
//       if (record.name) {
//         const existName = await validateHelper.checkExistField({
//           fieldCheck: 'name',
//           valueCheck: record.name,
//           modelName: 'Category',
//           referenceId: doc._id
//         })
//         if (existName) {
//           throw new ApolloError(
//             ERROR_MESSAGE.NAME_EXISTS.text,
//             ERROR_MESSAGE.NAME_EXISTS.extensionCode
//           )
//         }
//       }
//       // check duplicate slug
//       if (record.slug) {
//         const existSlug = await validateHelper.checkExistField({
//           fieldCheck: 'slug',
//           valueCheck: record.slug,
//           modelName: 'Category',
//           referenceId: doc._id
//         })

//         if (existSlug) {
//           throw new ApolloError(
//             ERROR_MESSAGE.SLUG_EXISTS.text,
//             ERROR_MESSAGE.SLUG_EXISTS.extensionCode
//           )
//         }
//       }
//     }
//     return doc
//   }
//   return next(rp)
// })


export default CategoryTC
