// composer
import composer from '../composer'
// constant
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const CustomerTC = composer.CustomerTC

export default {
  createCustomer: CustomerTC.getResolver(RESOLVER_CREATE_ONE),
  updateCustomer: CustomerTC.getResolver(RESOLVER_UPDATE_BY_ID),
  deleteCustomer: CustomerTC.getResolver(RESOLVER_REMOVE_BY_ID)
}
