// libs
import dotenv from 'dotenv'
const fs = require('fs')
const mime = require('mime')
const sharp = require('sharp')
const https = require('https')
// composers
import composer from '../schemas/composer'
// constants
import {
  PRODUCT_UPLOAD_PATH,
  BANNER_UPLOAD_PATH,
  RECIPE_UPLOAD_PATH,
  HTML_BLOCK_UPLOAD_PATH,
  UPLOAD_TYPE
} from '../constants/image'
import { RESOLVER_CREATE_ONE } from '../constants/resolver'
// helpers
import stringHelper from '../extensions/string'

dotenv.config()

const generatePathFileByType = (type) => {
  switch (type) {
    case UPLOAD_TYPE.PRODUCT:
      return PRODUCT_UPLOAD_PATH
    case UPLOAD_TYPE.RECIPE:
      return RECIPE_UPLOAD_PATH
    case UPLOAD_TYPE.BANNER:
      return BANNER_UPLOAD_PATH
    case UPLOAD_TYPE.HTML_BLOCK:
      return HTML_BLOCK_UPLOAD_PATH
    default:
      return PRODUCT_UPLOAD_PATH
  }
}

const uploadImageAWS = async (file, type) => {
  try {
    // get path file
    const oldFilename = stringHelper.generateRandomStringWithUppercase(file.originalname.length)
    const newFileName = `${Date.now()}-${oldFilename}`
    // get file extension from fileType
    const fileExtension = mime.getExtension(file.mimetype)
    // upload server AWS
    // const fileUploadAWS = await s3.upload(params).promise()
    // create object file to db
    const dataClause = {
      filename: file.filename,
      mimetype: file.mimetype,
      fileExtension: fileExtension,
      encoding: file.encoding,
      fileType: type,
      // originalUrl: fileUploadAWS.Location,
      originalUrl: `${process.env.BACK_END_URL_IMAGE}/${file.path.split('\\').join(`/`)}`,
      contentType: file.mimetype.toString(),
    }
    // return await models.File.create()

    const fileRecord = await composer.FileTC.getResolver(
      RESOLVER_CREATE_ONE
    ).resolve({
      args: {
        record: dataClause,
      },
    })

    return fileRecord ? fileRecord.record : null
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * UPLOAD MULTI FILE
 * @param {*} req
 * @param {*} res
 */
const uploadMultipleFiles = async (req, res) => {
  const uploadFiles = req.files || []
  const uploadType = req.headers.uploadtype
  const uploadFilePromises = await Promise.all(
    uploadFiles.map(async (file) => {
      return await uploadImageAWS(file, uploadType)
    })
  )
  return res.status(200).send(uploadFilePromises)
}


export default {
  uploadMultipleFiles,
  generatePathFileByType,
  uploadImageAWS
}