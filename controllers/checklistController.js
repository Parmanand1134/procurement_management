// const Checklist = require('../models/checklist');

// exports.createChecklist = async (req, res) => {
//     const { name, questions } = req.body;
//     try {
//         const checklist = await Checklist.create({ name, questions });
//         res.status(201).json(checklist);
//     } catch (error) {
//         res.status(400).json({ error: 'Failed to create checklist' });
//     }
// };

// exports.getChecklists = async (req, res) => {
//     try {
//         const checklists = await Checklist.find();
//         res.json(checklists);
//     } catch (error) {
//         res.status(400).json({ error: 'Failed to fetch checklists' });
//     }
// };

// exports.uploadImage = async (req, res) => {
//     const { checklistId } = req.params;
//     const { file } = req; // Assuming you're using multer for file uploads

//     try {
//         const checklist = await Checklist.findById(checklistId);
//         if (!checklist) {
//             return res.status(404).json({ error: 'Checklist not found' });
//         }
//         checklist.images.push(file.path);
//         await checklist.save();
//         res.json({ message: 'Image uploaded successfully', imageUrl: file.path });
//     } catch (error) {
//         res.status(400).json({ error: 'Failed to upload image' });
//     }
// };


const Checklist = require('../models/checklist');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');

exports.createChecklist = async (req, res) => {
    const { client, questions } = req.body;

    const newChecklist = new Checklist({
        client: req.user.id, // Associate checklist with the user creating it
        questions
    });

    try {
        const savedChecklist = await newChecklist.save();
        res.status(201).json({ message: 'Checklist created successfully', checklist: savedChecklist });
    } catch (error) {
        res.status(400).json({ error: 'Error creating checklist', details: error.message });
    }
};

exports.getChecklists = async (req, res) => {
    try {
        const checklists = await Checklist.find({ client: req.user.id }); // Fetch only the client's checklists
        res.status(200).json(checklists);
    } catch (error) {
        res.status(400).json({ error: 'Error retrieving checklists', details: error.message });
    }
};

exports.updateChecklist = async (req, res) => {
    const { checklistId, questions } = req.body;

    try {
        const updatedChecklist = await Checklist.findByIdAndUpdate(checklistId, { questions }, { new: true });
        if (!updatedChecklist) {
            return res.status(404).json({ error: 'Checklist not found' });
        }
        res.status(200).json({ message: 'Checklist updated successfully', checklist: updatedChecklist });
    } catch (error) {
        res.status(400).json({ error: 'Error updating checklist', details: error.message });
    }
};



exports.submitChecklistAnswers = async (req, res) => {
    const { checklistId, answers } = req.body;

    try {
        const checklist = await Checklist.findById(checklistId);
        if (!checklist) {
            return res.status(404).json({ error: 'Checklist not found' });
        }

        // Validate answers
        for (let i = 0; i < checklist.questions.length; i++) {
            const question = checklist.questions[i];
            const answer = answers[i];

            // Check required fields
            if (question.isRequired && (!answer || (question.answerType === 'image_upload' && (!req.files || req.files.length === 0)))) {
                return res.status(400).json({ error: `Answer for question "${question.questionText}" is required.` });
            }

            // Handle image uploads
            if (question.answerType === 'image_upload' && req.files) {
                const imageUrls = req.files.map(file => path.join(uploadsDir, file.filename));
                question.uploadedImages = imageUrls; // Store paths of uploaded images
            }
        }

        // Save the checklist (this can be adapted to save answers in a separate collection or update the checklist as needed)
        await checklist.save();
        res.status(200).json({ message: 'Checklist answers submitted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error submitting checklist answers', details: error.message });
    }
};
