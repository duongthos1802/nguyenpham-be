import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'

const FAQTC = composer.FAQTC

export default {
  faq: FAQTC.getResolver(RESOLVER_FIND_BY_ID),
  faqs: FAQTC.getResolver(RESOLVER_FIND_MANY),
  faqsConnection: FAQTC.getResolver(RESOLVER_CONNECTION),
  faqsCount: FAQTC.getResolver(RESOLVER_COUNT),
  faqsPagination: FAQTC.getResolver(RESOLVER_PAGINATION)
}
