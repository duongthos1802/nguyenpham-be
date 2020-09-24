import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'
const LocationTC = composer.LocationTC

export default {
  location: LocationTC.getResolver(RESOLVER_FIND_BY_ID),
  locations: LocationTC.getResolver(RESOLVER_FIND_MANY),
  locationsConnection: LocationTC.getResolver(RESOLVER_CONNECTION),
  locationsCount: LocationTC.getResolver(RESOLVER_COUNT),
  locationsPagination: LocationTC.getResolver(RESOLVER_PAGINATION)
}
