// const express = require('express');
// const { createChecklist, getChecklists, uploadImage } = require('../controllers/checklistController');
// const authMiddleware = require('../middleware/auth');
// const authorize = require('../middleware/authorize');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Set up for file uploads

// const router = express.Router();

// // Only procurement managers can create checklists
// router.post('/', authMiddleware, authorize(['procurement_manager']), createChecklist);
// router.get('/', authMiddleware, getChecklists);
// router.post('/:checklistId/upload', authMiddleware, upload.single('image'), uploadImage);

// module.exports = router;

const express = require('express');
const { createChecklist, getChecklists, updateChecklist, submitChecklistAnswers } = require('../controllers/checklistController');
const authMiddleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/multerMiddleware'); // Import the multer middleware

const router = express.Router();

router.post('/', authMiddleware, createChecklist);
router.get('/', authMiddleware, getChecklists);
router.patch('/', authMiddleware, updateChecklist);

// Route for submitting answers to the checklist (with image uploads)
router.post('/answers', authMiddleware, uploadMiddleware, submitChecklistAnswers);

module.exports = router;



// {
//     "checklistId": "checklistIdHere",
//     "answers": [
//         true, // For boolean question
//         "Eatable", // For dropdown selection
//         ["imageFile1", "imageFile2"], // For image uploads (these will be handled by multer)
//         "Driver details" // For text answer
//     ]
// }

