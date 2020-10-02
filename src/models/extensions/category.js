import models from '..'

/**
 * CHECK EXIST SLUG
 * @param {*} name
 * @param {*} categoryId
 */
export const checkExistName = async (name, categoryId) => {
  if (!name) {
    return null
  }
  const queryClause = {
    name: name
  }
  if (categoryId) {
    queryClause._id = {
      $ne: categoryId
    }
  }

  return await models.Category.findOne(queryClause)
}

/**
 * CHECK EXIST SLUG
 * @param {*} slug
 * @param {*} categoryId
 */
export const checkExistSlug = async (slug, categoryId) => {
  if (!slug) {
    return null
  }
  const queryClause = {
    name: slug
  }
  if (categoryId) {
    queryClause._id = {
      $ne: categoryId
    }
  }

  return await models.Category.findOne(queryClause)
}

export default {
  checkExistName,
  checkExistSlug
}
