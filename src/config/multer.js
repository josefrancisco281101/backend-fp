import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const newName = `${Date.now()}-${file.originalname}`
        console.log(newName)
        cb(null, newName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Solo se permiten imágenes.'))
    }
}

const uploadImage = multer({ storage, fileFilter })
export default uploadImage