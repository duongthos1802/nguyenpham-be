import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const HtmlBlockTC = composer.HtmlBlockTC

export default {
  htmlBlock: HtmlBlockTC.getResolver(RESOLVER_FIND_BY_ID),
  htmlBlocks: HtmlBlockTC.getResolver(RESOLVER_FIND_MANY),
  htmlBlocksConnection: HtmlBlockTC.getResolver(RESOLVER_CONNECTION),
  htmlBlocksCount: HtmlBlockTC.getResolver(RESOLVER_COUNT),
  htmlBlocksPagination: HtmlBlockTC.getResolver(RESOLVER_PAGINATION)
}
