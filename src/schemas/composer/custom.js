import { schemaComposer } from 'graphql-compose'
import models from "../../models";
import { UserTC } from '../composer/user'
import { UserSessionTC } from '../composer/userSession'
import ProductTC from './product';
import HtmlBlockGroupTC from './htmlBlockGroup';

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
