import models from '..'

export const checkExistField = async ({
  modelName,
  fieldCheck,
  valueCheck,
  referenceId
}) => {
  if (!models[modelName] || !fieldCheck || !valueCheck) {
    return false
  }

  const whereClause = {
    [`${fieldCheck}`]: valueCheck
  }

  if (referenceId) {
    whereClause._id = { $ne: referenceId }
  }

  return await models[modelName].findOne(whereClause)
}

export const checkExistMultiFields = async ({
  modelName,
  referenceId,
  valueCheck = {}
}) => {
  if (!models[modelName] || !valueCheck) {
    return false
  }


  const whereClause = valueCheck

  if (referenceId) {
    whereClause._id = { $ne: referenceId }
  }

  return await models[modelName].findOne(whereClause)
  
}

export default {
  checkExistField,
  checkExistMultiFields
}
