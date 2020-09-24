// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const HtmlBlockTC = composer.HtmlBlockTC

export default {
  createHtmlBlock: HtmlBlockTC.getResolver(RESOLVER_CREATE_ONE),
  updateHtmlBlock: HtmlBlockTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyHtmlBlocks: HtmlBlockTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteHtmlBlock: HtmlBlockTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyHtmlBlocks: HtmlBlockTC.getResolver(RESOLVER_REMOVE_MANY)
}
