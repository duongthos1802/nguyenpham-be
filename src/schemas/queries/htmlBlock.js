import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_FIND_ONE,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT,
  RESOLVER_HTML_BLOCK_FIND_MANY,
  RESOLVER_HTML_BLOCK_COUNT
} from '../../constants/resolver'
const HtmlBlockTC = composer.HtmlBlockTC

export default {
  htmlBlock: HtmlBlockTC.getResolver(RESOLVER_FIND_BY_ID),
  htmlBlockFindOne: HtmlBlockTC.getResolver(RESOLVER_FIND_ONE),
  htmlBlocks: HtmlBlockTC.getResolver(RESOLVER_HTML_BLOCK_FIND_MANY),
  htmlBlocksConnection: HtmlBlockTC.getResolver(RESOLVER_CONNECTION),
  htmlBlocksCount: HtmlBlockTC.getResolver(RESOLVER_HTML_BLOCK_COUNT),
  htmlBlocksPagination: HtmlBlockTC.getResolver(RESOLVER_PAGINATION)
}
