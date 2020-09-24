import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const VideoTC = composer.VideoTC

export default {
  video: VideoTC.getResolver(RESOLVER_FIND_BY_ID),
  videos: VideoTC.getResolver(RESOLVER_FIND_MANY),
  videosConnection: VideoTC.getResolver(RESOLVER_CONNECTION),
  videosCount: VideoTC.getResolver(RESOLVER_COUNT),
  videosPagination: VideoTC.getResolver(RESOLVER_PAGINATION)
}
