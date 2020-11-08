import { schemaComposer } from 'graphql-compose'
import { UserTC } from '../composer/user'
import { UserSessionTC } from '../composer/userSession'
import ProductTC from './product';
import HtmlBlockGroupTC from './htmlBlockGroup';
import RecipeTC from './recipe';
import CategoryTC from './category';
import BlogTC from './blog';
import VideoTC from './video';
import BannerGroupTC from './bannerGroup';

export const UserPermissonTC = schemaComposer.createObjectTC({
  name: "UserPermisson",
  fields: {
    resource: "String",
    action: "String",
  },
});

export const AuthAdminTC = schemaComposer.createObjectTC({
  name: "AuthAdmin",
  fields: {
    token: "String!",
    user: UserTC,
    userSession: UserSessionTC,
    permissions: [UserPermissonTC]
  },
});

export const CategoryFeatureTC = schemaComposer.createObjectTC({
  name: 'CategoryFeature',
  fields: {
    _id: 'ID!',
    index: 'Int!',
    name: 'String!',
    slug: 'String',
    option: 'String',
    products: [ProductTC],
    recipes: [RecipeTC]
  }
})


export const EventHomeTC = schemaComposer.createObjectTC({
  name: 'EventModel',
  fields: {
    eventLeft: HtmlBlockGroupTC,
    urlVideo: "String",
    eventRightActive: "String",
    bannerGroup: BannerGroupTC
  }
})

export const SearchProductTC = schemaComposer.createObjectTC({
  name: "SearchProduct",
  fields: {
    items: [ProductTC],
    total: "Int",
  },
})

export const SearchRecipeTC = schemaComposer.createObjectTC({
  name: "SearchRecipe",
  fields: {
    items: [RecipeTC],
    total: "Int",
  },
})

export const SearchCategoryTC = schemaComposer.createObjectTC({
  name: "SearchCategory",
  fields: {
    items: [CategoryTC],
    total: "Int",
  },
});

export const RecipeCustomTC = schemaComposer.createObjectTC({
  name: "RecipeCustom",
  fields: {
    category: CategoryTC,
    categories: [CategoryTC],
    recipes: [RecipeTC],
    total: 'Int'
  },
})

export const ProductCustomTC = schemaComposer.createObjectTC({
  name: "ProductCustom",
  fields: {
    category: CategoryTC,
    categories: [CategoryTC],
    products: [ProductTC],
    total: 'Int'
  },
})

export const BlogCustomTC = schemaComposer.createObjectTC({
  name: "BlogCustom",
  fields: {
    category: CategoryTC,
    blogs: [BlogTC],
    total: 'Int'
  },
})

export const SearchBlogTC = schemaComposer.createObjectTC({
  name: "SearchBlog",
  fields: {
    items: [BlogTC],
    total: "Int",
  },
})

export const SearchBlogFeaturesTC = schemaComposer.createObjectTC({
  name: "SearchBlogFeatures",
  fields: {
    blogFeatures: [BlogTC],
    categoryBlog: [CategoryTC],
  },
})

export const SearchVideoTC = schemaComposer.createObjectTC({
  name: "SearchVideo",
  fields: {
    category: CategoryTC,
    items: [VideoTC],
    total: "Int",
  },
})

export const VideoCustomTC = schemaComposer.createObjectTC({
  name: "VideoCustomTC",
  fields: {
    category: CategoryTC,
    categoriesVideo: [CategoryTC],
    videoTrending: VideoTC,
  },
})

export const TrendingTC = schemaComposer.createObjectTC({
  name: "SearchTrending",
  fields: {
    category: CategoryTC,
    option: "String"
  },
})
