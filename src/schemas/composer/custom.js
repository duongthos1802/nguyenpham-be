import { schemaComposer } from 'graphql-compose'
import models from "../../models";
import { UserTC } from '../composer/user'
import { UserSessionTC } from '../composer/userSession'

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
    permissions: [ UserPermissonTC ]
  },
});
