import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const HtmlBlockGroupTC = composer.HtmlBlockGroupTC

export default {
  htmlBlockGroup: HtmlBlockGroupTC.getResolver(RESOLVER_FIND_BY_ID),
  htmlBlockGroups: HtmlBlockGroupTC.getResolver(RESOLVER_FIND_MANY),
  htmlBlockGroupsConnection: HtmlBlockGroupTC.getResolver(RESOLVER_CONNECTION),
  htmlBlockGroupsCount: HtmlBlockGroupTC.getResolver(RESOLVER_COUNT),
  htmlBlockGroupsPagination: HtmlBlockGroupTC.getResolver(RESOLVER_PAGINATION)
}
