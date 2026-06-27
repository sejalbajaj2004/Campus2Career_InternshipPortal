// const express = require('express');
// const router = express.Router();
// const Internship = require('../models/Internship');
// const Application = require('../models/Application');
// const Settings = require('../models/Settings');
// const { requireAuth, requireCompany, requireStudent } = require('../middleware/auth');
// const StudentProfile = require('../models/StudentProfile');

// // ─── COMPANY DASHBOARD ───────────────────────────────────────────────────────

// // GET /dashboard - Company dashboard
// router.get('/dashboard', requireAuth, requireCompany, async (req, res) => {
//     try {
//         // const totalInternships = await Internship.countDocuments();
//         // const totalApplications = await Application.countDocuments();
//         // const activeInternships = await Internship.countDocuments({ status: 'active' });
//         // const shortlistedCandidates = await Application.countDocuments({ status: 'shortlisted' });
//         // const recentInternships = await Internship.find().sort({ postedDate: -1 }).limit(5);
//         const companyId = req.user.id;
//         const myInternshipIds = await Internship.find({ createdBy: companyId }).distinct('_id');

//         const totalInternships = await Internship.countDocuments({ createdBy: companyId });
//         const totalApplications = await Application.countDocuments({ internshipId: { $in: myInternshipIds } });
//         const activeInternships = await Internship.countDocuments({ createdBy: companyId, status: 'active' });
//         const shortlistedCandidates = await Application.countDocuments({ internshipId: { $in: myInternshipIds }, status: 'shortlisted' });
//         const recentInternships = await Internship.find({ createdBy: companyId }).sort({ postedDate: -1 }).limit(5);

//         res.render('dashboard', {
//             user: req.user,
//             stats: { totalInternships, totalApplications, activeInternships, shortlistedCandidates },
//             internships: recentInternships
//         });
//     } catch (error) {
//         console.error('Dashboard error:', error);
//         res.status(500).send('Server Error');
//     }
// });

// // GET /post-internship - Post internship page
// router.get('/post-internship', requireAuth, requireCompany, (req, res) => {
//     res.render('post-internship', { user: req.user });
// });

// // GET /applicants - View all applicants
// // router.get('/applicants', requireAuth, requireCompany, async (req, res) => {
// //     try {
// //         const applications = await Application.find()
// //             .populate('internshipId', 'title department')
// //             .populate('studentId', 'name email');

// //         res.render('view-applicants', { applications, user: req.user });
// //     } catch (error) {
// //         console.error('Applicants error:', error);
// //         res.status(500).send('Server Error');
// //     }
// // });

// // GET /applicants - View all applicants
// router.get('/applicants', requireAuth, requireCompany, async (req, res) => {
//     try {
//         const StudentProfile = require('../models/StudentProfile');

//         // const rawApplications = await Application.find(
//         //     .populate('internshipId', 'title department')
//         //     .populate('studentId', 'name email')
//         //     .sort({ appliedDate: -1 });
//         const myInternshipIds = await Internship.find({ createdBy: req.user.id }).distinct('_id');
//         const rawApplications = await Application.find({ internshipId: { $in: myInternshipIds } })
//             .populate('internshipId', 'title department')
//             .populate('studentId', 'name email')
//             .sort({ appliedDate: -1 });

//         const applications = await Promise.all(rawApplications.map(async (app) => {
//             const profile = await StudentProfile.findOne({ userId: app.studentId?._id });
//             return {
//                 id:                   app._id,
//                 status:               app.status,
//                 coverLetter:          app.coverLetter,
//                 appliedDate:          app.appliedDate,
//                 studentName:          app.studentId?.name  || 'Unknown',
//                 studentEmail:         app.studentId?.email || '',
//                 internshipTitle:      app.internshipId?.title      || '',
//                 internshipDepartment: app.internshipId?.department || '',
//                 profileImage:         profile?.profileImage   || '',
//                 university:           profile?.university     || '',
//                 major:                profile?.major          || '',
//                 graduationYear:       profile?.graduationYear || '',
//                 location:             profile?.location       || '',
//                 skills:               profile?.skills         || [],
//                 about:                profile?.about          || '',
//                 linkedin:             profile?.linkedin       || '',
//                 github:               profile?.github         || '',
//                 resume:               profile?.resume         || '',
//                 resumeOrigName:       profile?.resumeOrigName || 'Resume.pdf',
//             };
//         }));

//         res.render('view-applicants', { applications, user: req.user });
//     } catch (error) {
//         console.error('Applicants error:', error);
//         res.status(500).send('Server Error');
//     }
// });


// // GET /analytics - Analytics page
// router.get('/analytics', requireAuth, requireCompany, async (req, res) => {
//     try {
//         // const internships = await Internship.find();
//         // const applications = await Application.find();
//         const internships = await Internship.find({ createdBy: req.user.id });
//         const internshipIds = internships.map(i => i._id);
//         const applications = await Application.find({ internshipId: { $in: internshipIds } });
//         const analytics = generateAnalyticsData(internships, applications);
//         res.render('analytics', { analytics, user: req.user });
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });

// // GET /reports - Reports page
// router.get('/reports', requireAuth, requireCompany, async (req, res) => {
//     try {
//         // const internships = await Internship.find();
//         // const applications = await Application.find();
//         const internships = await Internship.find({ createdBy: req.user.id });
//         const internshipIds = internships.map(i => i._id);
//         const applications = await Application.find({ internshipId: { $in: internshipIds } });
//         res.render('reports', { internships, applications, user: req.user });
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });

// // GET /support - Support page
// router.get('/support', requireAuth, (req, res) => {
//     res.render('support', { user: req.user });
// });

// // GET /settings - Settings page
// router.get('/settings', requireAuth, requireCompany, async (req, res) => {
//     try {
//         const settings = await Settings.findOne() || {};
//         res.render('settings', { settings, user: req.user });
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });


// router.get('/student-dashboard', requireAuth, requireStudent, async (req, res) => {
//     try {
//         const internships = await Internship.find({ status: 'active' }).sort({ postedDate: -1 });
//         const rawApplications = await Application.find({ studentId: req.user.id })
//             .populate('internshipId', 'title department');

//         const stats = {
//             totalApplications: rawApplications.length,
//             shortlisted: rawApplications.filter(a => a.status === 'shortlisted').length,
//             pending:     rawApplications.filter(a => a.status === 'pending').length,
//             rejected:    rawApplications.filter(a => a.status === 'rejected').length
//         };

//         // Map populated data to flat fields the EJS expects
//         const mappedApplications = rawApplications.map(app => ({
//             _id:                 app._id,
//             status:              app.status,
//             appliedDate:         app.appliedDate,
//             internshipId:        app.internshipId?._id,
//             internshipTitle:     app.internshipId?.title      || 'N/A',
//             internshipDepartment:app.internshipId?.department || 'N/A',
//         }));

//         res.render('student-dashboard', {
//             user: req.user,
//             stats,
//             recentApplications:   mappedApplications.slice(0, 3),
//             latestInternships:    internships.slice(0, 4),
//             availableInternships: internships.length
//         });
//     } catch (error) {
//         console.error('Student dashboard error:', error);
//         res.status(500).send('Server Error');
//     }
// });

// // GET /student-internships - Browse internships
// router.get('/student-internships', requireAuth, requireStudent, async (req, res) => {
//     try {
//         const { search, department, location } = req.query;
//         let query = { status: 'active' };

//         if (search) query.$or = [
//             { title: new RegExp(search, 'i') },
//             { description: new RegExp(search, 'i') },
//             { department: new RegExp(search, 'i') }
//         ];
//         if (department) query.department = new RegExp(department, 'i');
//         if (location) query.location = new RegExp(location, 'i');

//         // const internships = await Internship.find(query);
//         const internships = await Internship.find(query);
// const studentProfile = await StudentProfile.findOne({ userId: req.user.id });
// const studentSkills = studentProfile?.skills || [];
//         const applications = await Application.find({ studentId: req.user.id });

//         res.render('student-internships', {
//             studentSkills,
//             user: req.user, internships, applications,
//             searchQuery: search || '',
//             selectedDepartment: department || '',
//             selectedLocation: location || ''
//         });
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });

// // GET /student-internships/:id - Single internship detail
// router.get('/student-internships/:id', requireAuth, requireStudent, async (req, res) => {
//     try {
//         const internship = await Internship.findById(req.params.id);
//         if (!internship) return res.status(404).render('404', { user: req.user });

//         const hasApplied = await Application.exists({ internshipId: req.params.id, studentId: req.user.id });
//         res.render('internship-details', { user: req.user, internship, hasApplied: !!hasApplied });
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });


// router.get('/student-applications', requireAuth, requireStudent, async (req, res) => {
//     try {
//         const rawApplications = await Application.find({ studentId: req.user.id })
//             .populate('internshipId')
//             .sort({ appliedDate: -1 });

//         const applications = rawApplications.map(app => ({
//             _id:                 app._id,
//             status:              app.status,
//             appliedDate:         app.appliedDate,
//             reviewedAt:          app.reviewedAt,
//             coverLetter:         app.coverLetter,
//             internshipId:        app.internshipId?._id,        // ← used in "View Job" link
//             internshipTitle:     app.internshipId?.title       || 'N/A',
//             internshipDepartment:app.internshipId?.department  || 'N/A',
//             internshipLocation:  app.internshipId?.location    || 'Not specified',
//             internshipCompany:   app.internshipId?.company     || '',
//             internshipDuration:  app.internshipId?.duration    || 'Not specified',
//         }));

//         res.render('student-applications', { user: req.user, applications });
//     } catch (error) {
//         console.error('Student applications error:', error);
//         res.status(500).send('Server Error');
//     }
// });
// // GET /student-profile - Student profile page
// // router.get('/student-profile', requireAuth, requireStudent, async (req, res) => {
// //     try {
// //         const StudentProfile = require('../models/StudentProfile');
// //         const profile = await StudentProfile.findOne({ userId: req.user.id }) || {};
// //         res.render('student-profile', { user: req.user, profile });
// //     } catch (error) {
// //         res.status(500).send('Server Error');
// //     }
// // });
//   // add this import if missing
 
// // GET /student-profile  →  renders views/student-profile.ejs
// router.get('/student-profile', requireAuth,requireStudent, async (req, res) => {
//     try {
//         // Fetch the profile; if none exists yet, use an empty object
//         let profile = await StudentProfile.findOne({ userId: req.user.id });
//         if (!profile) {
//             profile = {
//                 fullName: '', phone: '', university: '', major: '',
//                 graduationYear: '', gpa: '', location: '', about: '',
//                 skills: [], experience: '', projects: '',
//                 resume: '', resumeOrigName: '', resumeUpdatedAt: null
//             };
//         }
 
//         res.render('student-profile', {
//             user:    req.user,   // has .name and .email
//             profile: profile
//         });
//     } catch (error) {
//         console.error('student-profile render error:', error);
//         res.status(500).send('Server error');
//     }
// });
 

// // GET /apply-internship/:id - Apply page
// router.get('/apply-internship/:id', requireAuth, requireStudent, async (req, res) => {
//     try {
//         const internship = await Internship.findById(req.params.id);
//         if (!internship) return res.status(404).render('404', { user: req.user });

//         const hasApplied = await Application.exists({ internshipId: req.params.id, studentId: req.user.id });
//         if (hasApplied) return res.redirect('/student-applications');

//         const StudentProfile = require('../models/StudentProfile');
//         const profile = await StudentProfile.findOne({ userId: req.user.id }) || {};
//         res.render('apply-internship', { user: req.user, internship, profile });
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });

// // ─── ANALYTICS HELPER ────────────────────────────────────────────────────────

// function generateAnalyticsData(internships, applications) {
//     const now = new Date();
//     const departmentStats = {};
//     internships.forEach(i => {
//         departmentStats[i.department] = (departmentStats[i.department] || 0) + 1;
//     });

//     const monthlyData = [];
//     for (let i = 5; i >= 0; i--) {
//         const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const monthKey = date.toISOString().substr(0, 7);
//         const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

//         monthlyData.push({
//             month: monthName,
//             internships: internships.filter(i =>
//                 i.postedDate && i.postedDate.toISOString().startsWith(monthKey)
//             ).length,
//             applications: applications.filter(a =>
//                 a.appliedDate && a.appliedDate.toISOString().startsWith(monthKey)
//             ).length
//         });
//     }

//     return {
//         summary: {
//             totalInternships: internships.length,
//             totalApplications: applications.length,
//             activeInternships: internships.filter(i => i.status === 'active').length,
//             avgApplicationsPerInternship: internships.length > 0
//                 ? (applications.length / internships.length).toFixed(1) : 0
//         },
//         departmentStats,
//         monthlyTrends: monthlyData,
//         statusBreakdown: {
//             pending: applications.filter(a => a.status === 'pending').length,
//             shortlisted: applications.filter(a => a.status === 'shortlisted').length,
//             rejected: applications.filter(a => a.status === 'rejected').length
//         },
//         topPerformingInternships: internships.map(i => {
//             const count = applications.filter(a =>
//                 a.internshipId?.toString() === i._id?.toString()
//             ).length;
//             return {
//                 title: i.title, department: i.department, applications: count,
//                 conversionRate: count > 0 ? (
//                     applications.filter(a =>
//                         a.internshipId?.toString() === i._id?.toString() && a.status === 'shortlisted'
//                     ).length / count * 100
//                 ).toFixed(1) : 0
//             };
//         }).sort((a, b) => b.applications - a.applications).slice(0, 5),
//         recentActivity: {
//             newInternshipsLastWeek: internships.filter(i =>
//                 new Date(i.postedDate) >= new Date(Date.now() - 7 * 86400000)
//             ).length,
//             newApplicationsLastWeek: applications.filter(a =>
//                 new Date(a.appliedDate) >= new Date(Date.now() - 7 * 86400000)
//             ).length
//         }
//     };
// }

// router.get('/about', requireAuth, (req, res) => {
//     res.render('about', { user: req.user });
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Settings = require('../models/Settings');
const { requireAuth, requireCompany, requireStudent } = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');
// Add this line at the top with your other requires
const pdfParse = require('pdf-parse');

// ─── COMPANY DASHBOARD ───────────────────────────────────────────────────────

// GET /dashboard - Company dashboard
router.get('/dashboard', requireAuth, requireCompany, async (req, res) => {
    try {
        // const totalInternships = await Internship.countDocuments();
        // const totalApplications = await Application.countDocuments();
        // const activeInternships = await Internship.countDocuments({ status: 'active' });
        // const shortlistedCandidates = await Application.countDocuments({ status: 'shortlisted' });
        // const recentInternships = await Internship.find().sort({ postedDate: -1 }).limit(5);
        const companyId = req.user.id;
        const myInternshipIds = await Internship.find({ createdBy: companyId }).distinct('_id');

        const totalInternships = await Internship.countDocuments({ createdBy: companyId });
        const totalApplications = await Application.countDocuments({ internshipId: { $in: myInternshipIds } });
        const activeInternships = await Internship.countDocuments({ createdBy: companyId, status: 'active' });
        const shortlistedCandidates = await Application.countDocuments({ internshipId: { $in: myInternshipIds }, status: 'shortlisted' });
        const recentInternships = await Internship.find({ createdBy: companyId }).sort({ postedDate: -1 }).limit(5);

        res.render('dashboard', {
            user: req.user,
            stats: { totalInternships, totalApplications, activeInternships, shortlistedCandidates },
            internships: recentInternships
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).send('Server Error');
    }
});

// GET /post-internship - Post internship page
router.get('/post-internship', requireAuth, requireCompany, (req, res) => {
    res.render('post-internship', { user: req.user });
});

// GET /applicants - View all applicants
// router.get('/applicants', requireAuth, requireCompany, async (req, res) => {
//     try {
//         const applications = await Application.find()
//             .populate('internshipId', 'title department')
//             .populate('studentId', 'name email');

//         res.render('view-applicants', { applications, user: req.user });
//     } catch (error) {
//         console.error('Applicants error:', error);
//         res.status(500).send('Server Error');
//     }
// });

// GET /applicants - View all applicants
router.get('/applicants', requireAuth, requireCompany, async (req, res) => {
    try {
        const StudentProfile = require('../models/StudentProfile');

        // const rawApplications = await Application.find(
        //     .populate('internshipId', 'title department')
        //     .populate('studentId', 'name email')
        //     .sort({ appliedDate: -1 });
        const myInternshipIds = await Internship.find({ createdBy: req.user.id }).distinct('_id');
        const rawApplications = await Application.find({ internshipId: { $in: myInternshipIds } })
            .populate('internshipId', 'title department')
            .populate('studentId', 'name email')
            .sort({ appliedDate: -1 });

        const applications = await Promise.all(rawApplications.map(async (app) => {
            const profile = await StudentProfile.findOne({ userId: app.studentId?._id });
            return {
                id:                   app._id,
                status:               app.status,
                coverLetter:          app.coverLetter,
                appliedDate:          app.appliedDate,
                studentName:          app.studentId?.name  || 'Unknown',
                studentEmail:         app.studentId?.email || '',
                internshipTitle:      app.internshipId?.title      || '',
                internshipDepartment: app.internshipId?.department || '',
                profileImage:         profile?.profileImage   || '',
                university:           profile?.university     || '',
                major:                profile?.major          || '',
                graduationYear:       profile?.graduationYear || '',
                location:             profile?.location       || '',
                skills:               profile?.skills         || [],
                about:                profile?.about          || '',
                linkedin:             profile?.linkedin       || '',
                github:               profile?.github         || '',
                resume:               profile?.resume         || '',
                resumeOrigName:       profile?.resumeOrigName || 'Resume.pdf',
            };
        }));

        res.render('view-applicants', { applications, user: req.user });
    } catch (error) {
        console.error('Applicants error:', error);
        res.status(500).send('Server Error');
    }
});


// GET /analytics - Analytics page
router.get('/analytics', requireAuth, requireCompany, async (req, res) => {
    try {
        // const internships = await Internship.find();
        // const applications = await Application.find();
        const internships = await Internship.find({ createdBy: req.user.id });
        const internshipIds = internships.map(i => i._id);
        const applications = await Application.find({ internshipId: { $in: internshipIds } });
        const analytics = generateAnalyticsData(internships, applications);
        res.render('analytics', { analytics, user: req.user });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// GET /reports - Reports page
router.get('/reports', requireAuth, requireCompany, async (req, res) => {
    try {
        // const internships = await Internship.find();
        // const applications = await Application.find();
        const internships = await Internship.find({ createdBy: req.user.id });
        const internshipIds = internships.map(i => i._id);
        const applications = await Application.find({ internshipId: { $in: internshipIds } });
        res.render('reports', { internships, applications, user: req.user });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// GET /support - Support page
router.get('/support', requireAuth, (req, res) => {
    res.render('support', { user: req.user });
});

// GET /settings - Settings page
router.get('/settings', requireAuth, requireCompany, async (req, res) => {
    try {
        const settings = await Settings.findOne() || {};
        res.render('settings', { settings, user: req.user });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.get('/student-dashboard', requireAuth, requireStudent, async (req, res) => {
    try {
        const internships = await Internship.find({ status: 'active' }).sort({ postedDate: -1 });
        const rawApplications = await Application.find({ studentId: req.user.id })
            .populate('internshipId', 'title department');

        const stats = {
            totalApplications: rawApplications.length,
            shortlisted: rawApplications.filter(a => a.status === 'shortlisted').length,
            pending:     rawApplications.filter(a => a.status === 'pending').length,
            rejected:    rawApplications.filter(a => a.status === 'rejected').length
        };

        // Map populated data to flat fields the EJS expects
        const mappedApplications = rawApplications.map(app => ({
            _id:                 app._id,
            status:              app.status,
            appliedDate:         app.appliedDate,
            internshipId:        app.internshipId?._id,
            internshipTitle:     app.internshipId?.title      || 'N/A',
            internshipDepartment:app.internshipId?.department || 'N/A',
        }));

        res.render('student-dashboard', {
            user: req.user,
            stats,
            recentApplications:   mappedApplications.slice(0, 3),
            latestInternships:    internships.slice(0, 4),
            availableInternships: internships.length
        });
    } catch (error) {
        console.error('Student dashboard error:', error);
        res.status(500).send('Server Error');
    }
});

// GET /student-internships - Browse internships
router.get('/student-internships', requireAuth, requireStudent, async (req, res) => {
    try {
        const { search, department, location } = req.query;
        let query = { status: 'active' };

        if (search) query.$or = [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { department: new RegExp(search, 'i') }
        ];
        if (department) query.department = new RegExp(department, 'i');
        if (location) query.location = new RegExp(location, 'i');

        // const internships = await Internship.find(query);
        const internships = await Internship.find(query);
const studentProfile = await StudentProfile.findOne({ userId: req.user.id });
const studentSkills = studentProfile?.skills || [];
        const applications = await Application.find({ studentId: req.user.id });

        res.render('student-internships', {
            studentSkills,
            user: req.user, internships, applications,
            searchQuery: search || '',
            selectedDepartment: department || '',
            selectedLocation: location || ''
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// GET /student-internships/:id - Single internship detail
router.get('/student-internships/:id', requireAuth, requireStudent, async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) return res.status(404).render('404', { user: req.user });

        const hasApplied = await Application.exists({ internshipId: req.params.id, studentId: req.user.id });
        res.render('internship-details', { user: req.user, internship, hasApplied: !!hasApplied });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.get('/student-applications', requireAuth, requireStudent, async (req, res) => {
    try {
        const rawApplications = await Application.find({ studentId: req.user.id })
            .populate('internshipId')
            .sort({ appliedDate: -1 });

        const applications = rawApplications.map(app => ({
            _id:                 app._id,
            status:              app.status,
            appliedDate:         app.appliedDate,
            reviewedAt:          app.reviewedAt,
            coverLetter:         app.coverLetter,
            internshipId:        app.internshipId?._id,        // ← used in "View Job" link
            internshipTitle:     app.internshipId?.title       || 'N/A',
            internshipDepartment:app.internshipId?.department  || 'N/A',
            internshipLocation:  app.internshipId?.location    || 'Not specified',
            internshipCompany:   app.internshipId?.company     || '',
            internshipDuration:  app.internshipId?.duration    || 'Not specified',
        }));

        res.render('student-applications', { user: req.user, applications });
    } catch (error) {
        console.error('Student applications error:', error);
        res.status(500).send('Server Error');
    }
});
// GET /student-profile - Student profile page
// router.get('/student-profile', requireAuth, requireStudent, async (req, res) => {
//     try {
//         const StudentProfile = require('../models/StudentProfile');
//         const profile = await StudentProfile.findOne({ userId: req.user.id }) || {};
//         res.render('student-profile', { user: req.user, profile });
//     } catch (error) {
//         res.status(500).send('Server Error');
//     }
// });
  // add this import if missing
 
// GET /student-profile  →  renders views/student-profile.ejs
router.get('/student-profile', requireAuth,requireStudent, async (req, res) => {
    try {
        // Fetch the profile; if none exists yet, use an empty object
        let profile = await StudentProfile.findOne({ userId: req.user.id });
        if (!profile) {
            profile = {
                fullName: '', phone: '', university: '', major: '',
                graduationYear: '', gpa: '', location: '', about: '',
                skills: [], experience: '', projects: '',
                resume: '', resumeOrigName: '', resumeUpdatedAt: null
            };
        }
 
        res.render('student-profile', {
            user:    req.user,   // has .name and .email
            profile: profile
        });
    } catch (error) {
        console.error('student-profile render error:', error);
        res.status(500).send('Server error');
    }
});
 

// GET /apply-internship/:id - Apply page
router.get('/apply-internship/:id', requireAuth, requireStudent, async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) return res.status(404).render('404', { user: req.user });

        const hasApplied = await Application.exists({ internshipId: req.params.id, studentId: req.user.id });
        if (hasApplied) return res.redirect('/student-applications');

        const StudentProfile = require('../models/StudentProfile');
        const profile = await StudentProfile.findOne({ userId: req.user.id }) || {};
        res.render('apply-internship', { user: req.user, internship, profile });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// ─── ANALYTICS HELPER ────────────────────────────────────────────────────────

function generateAnalyticsData(internships, applications) {
    const now = new Date();
    const departmentStats = {};
    internships.forEach(i => {
        departmentStats[i.department] = (departmentStats[i.department] || 0) + 1;
    });

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().substr(0, 7);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        monthlyData.push({
            month: monthName,
            internships: internships.filter(i =>
                i.postedDate && i.postedDate.toISOString().startsWith(monthKey)
            ).length,
            applications: applications.filter(a =>
                a.appliedDate && a.appliedDate.toISOString().startsWith(monthKey)
            ).length
        });
    }

    return {
        summary: {
            totalInternships: internships.length,
            totalApplications: applications.length,
            activeInternships: internships.filter(i => i.status === 'active').length,
            avgApplicationsPerInternship: internships.length > 0
                ? (applications.length / internships.length).toFixed(1) : 0
        },
        departmentStats,
        monthlyTrends: monthlyData,
        statusBreakdown: {
            pending: applications.filter(a => a.status === 'pending').length,
            shortlisted: applications.filter(a => a.status === 'shortlisted').length,
            rejected: applications.filter(a => a.status === 'rejected').length
        },
        topPerformingInternships: internships.map(i => {
            const count = applications.filter(a =>
                a.internshipId?.toString() === i._id?.toString()
            ).length;
            return {
                title: i.title, department: i.department, applications: count,
                conversionRate: count > 0 ? (
                    applications.filter(a =>
                        a.internshipId?.toString() === i._id?.toString() && a.status === 'shortlisted'
                    ).length / count * 100
                ).toFixed(1) : 0
            };
        }).sort((a, b) => b.applications - a.applications).slice(0, 5),
        recentActivity: {
            newInternshipsLastWeek: internships.filter(i =>
                new Date(i.postedDate) >= new Date(Date.now() - 7 * 86400000)
            ).length,
            newApplicationsLastWeek: applications.filter(a =>
                new Date(a.appliedDate) >= new Date(Date.now() - 7 * 86400000)
            ).length
        }
    };
}

router.get('/about', requireAuth, (req, res) => {
    res.render('about', { user: req.user });
});

// POST /api/student/analyze-resume - ATS Resume Analyzer
router.post('/api/student/analyze-resume', requireAuth, requireStudent, async (req, res) => {
    try {
        const { resumeUrl, jobDesc } = req.body;
        if (!resumeUrl) return res.json({ success: false, error: 'No resume found. Please upload your resume first.' });

        // Step 1: Fetch PDF from Cloudinary and extract text
//         let resumeText = '';
//         try {
//             const pdfResponse = await fetch(resumeUrl);
//             const buffer = await pdfResponse.arrayBuffer();
//             // const pdfParse = require('pdf-parse');
//             // const pdfData = await pdfParse(Buffer.from(buffer));
            
// const pdfParseModule = require('pdf-parse');
// const pdfParse = pdfParseModule.default || pdfParseModule;
// const pdfData = await pdfParse(Buffer.from(buffer));
//             resumeText = pdfData.text;
//         } catch (pdfErr) {
//             console.error('PDF parse error:', pdfErr);
//             return res.json({ success: false, error: 'Could not read your resume PDF. Please re-upload it.' });
//         }
let resumeText = '';
try {
    const pdfResponse = await fetch(resumeUrl);
    const buffer = await pdfResponse.arrayBuffer();
    const pdfData = await pdfParse(Buffer.from(buffer));  // ← no require() here
    resumeText = pdfData.text;
} catch (pdfErr) {
    console.error('PDF parse error:', pdfErr);
    return res.json({ success: false, error: 'Could not read your resume PDF. Please re-upload it.' });
}
        if (!resumeText || resumeText.trim().length < 50) {
            return res.json({ success: false, error: 'Resume appears to be empty or unreadable. Please re-upload.' });
        }

        // Step 2: Send extracted text to Groq
        const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer.

Here is the resume text:
"""
${resumeText.slice(0, 4000)}
"""
${jobDesc ? `\nJob Description to match against:\n${jobDesc}` : '\nNo job description provided — do a general ATS analysis.'}

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "score": <number 0-100>,
  "summary": "<one sentence overall assessment>",
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "sectionFeedback": {
    "contact": "<feedback>",
    "summary": "<feedback>",
    "experience": "<feedback>",
    "education": "<feedback>",
    "skills": "<feedback>"
  },
  "suggestions": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                max_tokens: 1500,
                temperature: 0.3,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || '';

        const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const result = JSON.parse(clean);

        res.json({ success: true, result });

    } catch (err) {
        console.error('ATS analysis error:', err);
        res.json({ success: false, error: 'Analysis failed. Please try again.' });
    }
});

module.exports = router;