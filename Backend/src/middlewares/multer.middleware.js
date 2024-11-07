import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
 export const upload = multer({
     storage,
 })



// import multer from 'multer';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/temp');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png/;
//     const extname = fileTypes.test(file.mimetype);
//     const basename = fileTypes.test(path.extname(file.originalname).toLowerCase());

//     if (extname && basename) {
//         return cb(null, true);
//     } else {
//         return cb(new Error('Only jpeg, jpg, or png images are allowed'), false);
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } 
// });

// export {upload};
