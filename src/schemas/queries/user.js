import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const UserTC = composer.UserTC

export default {
  user: UserTC.getResolver(RESOLVER_FIND_BY_ID),
  users: UserTC.getResolver(RESOLVER_FIND_MANY),
  usersConnection: UserTC.getResolver(RESOLVER_CONNECTION),
  usersCount: UserTC.getResolver(RESOLVER_COUNT),
  usersPagination: UserTC.getResolver(RESOLVER_PAGINATION)
}
