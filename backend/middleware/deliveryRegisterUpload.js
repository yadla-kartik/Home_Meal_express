const multer = require('multer')

const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg']

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error('Upload images in PNG, JPG or JPEG format only.'))
      return
    }

    cb(null, true)
  },
}).fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'idProofImage', maxCount: 1 },
])

function uploadDeliveryRegister(req, res, next) {
  upload(req, res, (err) => {
    if (!err) {
      next()
      return
    }

    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Each image must be under 5MB.' })
    }

    return res.status(400).json({
      message: err.message || 'Unable to upload files.',
    })
  })
}

module.exports = {
  uploadDeliveryRegister,
}
