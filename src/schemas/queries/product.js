import composer from '../composer'
import {
  RESOLVER_FIND_MANY,
  RESOLVER_FIND_BY_ID,
  RESOLVER_PAGINATION,
  RESOLVER_CONNECTION,
  RESOLVER_COUNT
} from '../../constants/resolver'
import { stringHelper, dateTimeHelper } from '../../extensions'
import { PRODUCT_STATUS } from '../../constants/enum'
import { FORMAT_DATE_EN, EUROPE_TIMEZONE } from '../../extensions/dateTime'

const ProductTC = composer.ProductTC

export default {
  product: ProductTC.getResolver(RESOLVER_FIND_BY_ID),
  products: ProductTC.getResolver(RESOLVER_FIND_MANY),
  productsConnection: ProductTC.getResolver(RESOLVER_CONNECTION),
  productsCount: ProductTC.getResolver(RESOLVER_COUNT),
  productsPagination: ProductTC.getResolver(RESOLVER_PAGINATION)
}
