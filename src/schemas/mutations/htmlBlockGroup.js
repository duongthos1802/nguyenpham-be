// composer
import composer from '../composer'
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const HtmlBlockGroupTC = composer.HtmlBlockGroupTC

export default {
  createHtmlBlockGroup: HtmlBlockGroupTC.getResolver(RESOLVER_CREATE_ONE),
  updateHtmlBlockGroup: HtmlBlockGroupTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyHtmlBlockGroups: HtmlBlockGroupTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteHtmlBlockGroup: HtmlBlockGroupTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyHtmlBlockGroups: HtmlBlockGroupTC.getResolver(RESOLVER_REMOVE_MANY)
}
