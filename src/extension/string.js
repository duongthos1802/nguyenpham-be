export const regexMongooseKeyword = (value = '') => {
    return new RegExp(`.*${value.replace(/(\W)/g, '\\$1')}.*`, 'i')
  }

  
export default {
  regexMongooseKeyword
}