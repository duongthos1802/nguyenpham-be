import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'
const FileTC = composer.FileTC

export default {
  file: FileTC.getResolver(RESOLVER_FIND_BY_ID),
  files: FileTC.getResolver(RESOLVER_FIND_MANY),
  filesConnection: FileTC.getResolver(RESOLVER_CONNECTION),
  filesCount: FileTC.getResolver(RESOLVER_COUNT),
  filesPagination: FileTC.getResolver(RESOLVER_PAGINATION)
}
