import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'
const FileTC = composer.FileTC

export default {
  createFile: FileTC.getResolver(RESOLVER_CREATE_ONE),
  updateFile: FileTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyFiles: FileTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteFile: FileTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyFiles: FileTC.getResolver(RESOLVER_REMOVE_MANY)
}
