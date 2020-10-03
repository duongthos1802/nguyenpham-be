import { schemaComposer } from 'graphql-compose'
import {
  PRODUCT_STATUS
} from '../../constants/enum'

const generateEnumValue = (enumValue) => {
  const enumComposer = {}
  Object.values(enumValue).map((value) => {
    enumComposer[value] = {
      value: value
    }
  })

  return enumComposer
}

export const ProductStatus = schemaComposer.createEnumTC({
  name: 'ProductStatus',
  values: generateEnumValue(PRODUCT_STATUS)
})
