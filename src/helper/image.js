const fs = require('fs')
const mime = require('mime')
const sharp = require('sharp')
const AWS = require('aws-sdk')
const https = require('https')

import { PRODUCT_PATH, RECIPE_PATH, UPLOAD_TYPE } from '../constants/image'
import stringHelper from '../extension/string'

const s3 = new AWS.S3()

const generatePathFileByType = (type) => {
  switch (type) {
    case UPLOAD_TYPE.PRODUCT:
      return PRODUCT_PATH
    case UPLOAD_TYPE.RECIPE:
      return RECIPE_PATH
    case UPLOAD_TYPE.BANNER:
      return BANNER_PATH
    default:
      return PRODUCT_PATH
  }
}

const uploadImageAWS = async (file, type) => {
  console.log('file', file)
  console.log('type', type)
  try {
    // get path file
    const pathFile = generatePathFileByType(type)
    const oldFilename = stringHelper.generateRandomStringWithUppercase(file.originalname.length)
    const newFileName = `${Date.now()}-${oldFilename}`
    // init params aws s3
    const params = {
      ACL: 'public-read',
      Body: file.buffer,
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      ContentType: file.mimetype,
      Key: `${pathFile}/${newFileName}`,
    }
    // get file extension from fileType
    const fileExtension = mime.getExtension(file.mimetype)
    // upload server AWS
    const fileUploadAWS = await s3.upload(params).promise()
    // create object file to db
    const dataClause = {
      filename: newFileName,
      mimetype: file.mimetype,
      fileExtension: fileExtension,
      encoding: file.encoding,
      fileType: type,
      originalUrl: fileUploadAWS.Location,
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
  console.log('.req.headers.uploadtype', req.headers.uploadtype)
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