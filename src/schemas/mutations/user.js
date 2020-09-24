// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const UserTC = composer.UserTC

export default {
  createUser: UserTC.getResolver(RESOLVER_CREATE_ONE),
  updateUser: UserTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyUsers: UserTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteUser: UserTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyUsers: UserTC.getResolver(RESOLVER_REMOVE_MANY)
}
