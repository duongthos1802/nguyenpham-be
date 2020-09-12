import composeWithMongoose from 'graphql-compose-mongoose'
import composeWithDataLoader from 'graphql-compose-dataloader'
import models from '../../models'
import { CACHE_EXPIRATION, RESOLVER_FIND_BY_ID } from '../../constants/resolver'

export const AddressTC = composeWithDataLoader(
  composeWithMongoose(models.Address),
  {
    cacheExpiration: CACHE_EXPIRATION
  }
)

export default AddressTC
