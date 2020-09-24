// composer
import composer from '../composer'
// constant
import {
  RESOLVER_CREATE_ONE,
  RESOLVER_UPDATE_BY_ID,
  RESOLVER_UPDATE_MANY,
  RESOLVER_REMOVE_BY_ID,
  RESOLVER_REMOVE_MANY
} from '../../constants/resolver'

const FAQTC = composer.FAQTC

export default {
  createFAQ: FAQTC.getResolver(RESOLVER_CREATE_ONE),
  updateFAQ: FAQTC.getResolver(RESOLVER_UPDATE_BY_ID),
  updateManyFAQs: FAQTC.getResolver(RESOLVER_UPDATE_MANY),
  deleteFAQ: FAQTC.getResolver(RESOLVER_REMOVE_BY_ID),
  deleteManyFAQs: FAQTC.getResolver(RESOLVER_REMOVE_MANY)
}
