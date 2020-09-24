// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const VideoTC = composer.VideoTC

export default {
  createVideo: VideoTC.getResolver(RESOLVER_CREATE_ONE),
  updateVideo: VideoTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyVideos: VideoTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteVideo: VideoTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyVideos: VideoTC.getResolver(RESOLVER_REMOVE_MANY)
}
