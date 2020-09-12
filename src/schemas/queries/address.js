import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'
const AddressTC = composer.AddressTC

export default {
  address: AddressTC.getResolver(RESOLVER_FIND_BY_ID),
  addresses: AddressTC.getResolver(RESOLVER_FIND_MANY),
  addressesConnection: AddressTC.getResolver(RESOLVER_CONNECTION),
  addressesCount: AddressTC.getResolver(RESOLVER_COUNT),
  addressesPagination: AddressTC.getResolver(RESOLVER_PAGINATION)
}
