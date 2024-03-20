const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')

// const accessKeyId = "AKIARQEQJBKIEJTM3O7Y";
// const secretAccessKey = "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";

// Aws Access Keys
const accessKeyId = process.env.awsAccessKey
const secretAccessKey = process.env.awsSecretAccessKey

// configuring the AWS environment
AWS.config.update({
  accessKeyId,
  secretAccessKey
})

// const s3 = new AWS.S3();
const s3 = new S3Client({
  // region: "REGION",
  region: process.env.awsS3BucketRegion,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|tiff|pdf|mp4|webm|ogg|doc|docx|msword/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  if (extname) {
    cb(null, true)
  } else {
    cb('Error: File upload only supports the following filetypes - ' + filetypes, false)
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: process.env.awsS3BucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_METADATA' })
    },
    // contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `user_${Date.now()}_${file.originalname}`)
    }
  })
})

module.exports = upload
