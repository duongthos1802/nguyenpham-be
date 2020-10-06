import { schemaComposer } from 'graphql-compose'
import models from "../../models";
import { UserTC } from '../composer/user'
import { UserSessionTC } from '../composer/userSession'
import ProductTC from './product';
import HtmlBlockGroupTC from './htmlBlockGroup';
import RecipeTC from './recipe';
import CategoryTC from './category';
import BlogTC from './blog';
import VideoTC from './video';

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
    id: 'ID!',
    index: 'Int!',
    name: 'String!',
    slug: 'String',
    products: [ProductTC]
  }
})


export const EventHomeTC = schemaComposer.createObjectTC({
  name: 'EventModel',
  fields: {
    eventLeft: HtmlBlockGroupTC,
    eventRight: HtmlBlockGroupTC
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
})

export const SearchBlogTC = schemaComposer.createObjectTC({
  name: "SearchBlog",
  fields: {
    items: [BlogTC],
    total: "Int",
  },
})

export const SearchVideoTC = schemaComposer.createObjectTC({
  name: "SearchVideo",
  fields: {
    items: [VideoTC],
    total: "Int",
  },
})
