const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const Application    = require('../models/Application');
const Internship     = require('../models/Internship');
const StudentProfile = require('../models/StudentProfile');
const User           = require('../models/User');
const { requireAuth, requireStudentApi } = require('../middleware/auth');
const { sendNewApplicationEmail } = require('../services/emailService');

// ─── Cloudinary config ────────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Multer: Profile Image → Cloudinary ──────────────────────────────────────
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder:          'campus2career/profile-images',
        public_id:       `${req.user.id}_${Date.now()}`,
        resource_type:   'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation:  [{ width: 400, height: 400, crop: 'fill' }],
    }),
});
const uploadImage = multer({
    storage: imageStorage,
    limits:  { fileSize: 3 * 1024 * 1024 },
});

const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder:        'campus2career/resumes',
        public_id:     `${req.user.id}_${Date.now()}`,
        resource_type: 'raw',
        format:        'pdf',
        type:          'upload',  
        access_mode:   'public',   
    }),
});
const uploadResume = multer({
    storage: resumeStorage,
    limits:  { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        file.mimetype === 'application/pdf'
            ? cb(null, true)
            : cb(new Error('Only PDF files are allowed'));
    },
});

// ─── POST /api/student/apply ──────────────────────────────────────────────────
router.post('/apply', requireAuth, requireStudentApi, async (req, res) => {
    try {
        const { internshipId, coverLetter } = req.body;

        const internship = await Internship.findById(internshipId);
        if (!internship)
            return res.status(404).json({ success: false, error: 'Internship not found' });

        const hasApplied = await Application.exists({ internshipId, studentId: req.user.id });
        if (hasApplied)
            return res.status(400).json({ success: false, error: 'Already applied to this internship' });

        const newApplication = new Application({
            internshipId,
            studentId:   req.user.id,
            coverLetter: coverLetter || '',
            appliedDate: new Date(),
            status:      'pending'
        });
        await newApplication.save();
        await Internship.findByIdAndUpdate(internshipId, { $inc: { applicationsCount: 1 } });

        notifyCompany(internship, req.user);

        res.json({ success: true, message: 'Application submitted!', applicationId: newApplication._id });
    } catch (error) {
        console.error('Apply error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ─── Helper: email the company ────────────────────────────────────────────────
async function notifyCompany(internship, student) {
    try {
        if (!internship.createdBy) return;
        const companyUser = await User.findById(internship.createdBy).select('name email');
        if (!companyUser) return;
        await sendNewApplicationEmail(
            companyUser.email, companyUser.name,
            student.name, student.email, internship.title
        );
    } catch (err) {
        console.error('NOTIFY COMPANY ERROR:', err.message);
    }
}

// ─── PUT /api/student/profile ─────────────────────────────────────────────────
router.put('/profile', requireAuth, requireStudentApi, async (req, res) => {
    try {
        const body = { ...req.body };
        if (typeof body.skills === 'string') {
            body.skills = body.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
        const profile = await StudentProfile.findOneAndUpdate(
            { userId: req.user.id },
            { userId: req.user.id, ...body, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        res.json({ success: true, message: 'Profile updated!', profile });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ─── POST /api/student/profile-image ─────────────────────────────────────────
router.post('/profile-image', requireAuth, uploadImage.single('profileImage'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ success: false, error: 'No image uploaded' });

        // Delete old image from Cloudinary
        const existing = await StudentProfile.findOne({ userId: req.user.id });
        if (existing?.profileImagePublicId) {
            await cloudinary.uploader.destroy(existing.profileImagePublicId, { resource_type: 'image' });
        }

        await StudentProfile.findOneAndUpdate(
            { userId: req.user.id },
            {
                userId:               req.user.id,
                profileImage:         req.file.path,      // full Cloudinary URL
                profileImagePublicId: req.file.filename,  // for future deletion
                profileImageUpdatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, message: 'Profile image updated!', url: req.file.path });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ─── POST /api/student/resume ─────────────────────────────────────────────────
router.post('/resume', requireAuth, uploadResume.single('resume'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ success: false, error: 'No file uploaded' });

        // Delete old resume from Cloudinary
        const existing = await StudentProfile.findOne({ userId: req.user.id });
        if (existing?.resumePublicId) {
            // await cloudinary.uploader.destroy(existing.resumePublicId, { resource_type: 'raw' });
            await cloudinary.uploader.destroy(existing.resumePublicId, { resource_type: 'raw' });
        }
const publicUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/campus2career/resumes/${req.user.id}_${req.file.filename.split('_').pop()}`;

await StudentProfile.findOneAndUpdate(
    { userId: req.user.id },
    {
        userId:         req.user.id,
        resume:         req.file.path,          // Cloudinary URL
        resumePublicId: req.file.filename,
        resumeOrigName: req.file.originalname || 'resume.pdf',
        resumeUpdatedAt: new Date()
    },
    { upsert: true, new: true }
);

res.json({ success: true, message: 'Resume uploaded!', url: req.file.path });
    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ─── GET /api/student/dashboard ───────────────────────────────────────────────
router.get('/dashboard', requireAuth, requireStudentApi, async (req, res) => {
    try {
        const applications = await Application.find({ studentId: req.user.id });
        const availableInternships = await Internship.countDocuments({ status: 'active' });

        res.json({
            success: true,
            stats: {
                totalApplications: applications.length,
                shortlisted: applications.filter(a => a.status === 'shortlisted').length,
                pending:     applications.filter(a => a.status === 'pending').length,
                rejected:    applications.filter(a => a.status === 'rejected').length
            },
            availableInternships,
            recentApplications: applications.slice(-3).reverse()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;