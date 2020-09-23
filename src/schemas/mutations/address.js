import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const AddressTC = composer.AddressTC

export default {
  createAddress: AddressTC.getResolver(RESOLVER_CREATE_ONE),
  updateAddress: AddressTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyAddresses: AddressTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteAddress: AddressTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyAddresses: AddressTC.getResolver(RESOLVER_REMOVE_MANY)
}
