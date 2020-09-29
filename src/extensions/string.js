export const regexMongooseKeyword = (value = '') => {
  return new RegExp(`.*${value.replace(/(\W)/g, '\\$1')}.*`, 'i')
}

/**
 * TRIM AND LOWERCASE STRING
 * @param {*} string
 */
export const trimAndLowercaseText = (string) => {
  if (!string) {
    return null
  }
  return string.trim().toLowerCase()
}

export const validateMongoDBObjectId = (objectId) => {
  if (!objectId) {
    return false
  }
  const regex = /^[a-f\d]{24}$/i
  return regex.test(String(objectId).toLowerCase())
}

  
export default {
  regexMongooseKeyword,
  trimAndLowercaseText,
  validateMongoDBObjectId
}