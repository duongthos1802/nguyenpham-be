import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const LocationTC = composer.LocationTC

export default {
  createLocation: LocationTC.getResolver(RESOLVER_CREATE_ONE),
  updateLocation: LocationTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyLocations: LocationTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteLocation: LocationTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyLocations: LocationTC.getResolver(RESOLVER_REMOVE_MANY)
}
