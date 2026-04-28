const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateRegistration } = require('../middleware/validators');
const { isGuest, isAuthenticated } = require('../middleware/auth');

router.get('/login', isGuest, authController.getLoginPage);
router.post('/login', isGuest, validateLogin, authController.login);

router.get('/register', isGuest, authController.getRegisterPage);

router.post('/register', (req, res, next) => {
    console.log('Form submission received:');
    console.log('Body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    next();
}, isGuest, validateRegistration, authController.register);

router.get('/teacher-dashboard', isAuthenticated, async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'teacher') {
    req.flash('error', 'Veuillez vous connecter pour accéder à cette page');
    return res.redirect('/login');
    }

        try {
    const examController = require('../controllers/examController');
    const allExams = await examController.getExamsByTeacher(req.session.user.id);
    
    const recentExams = allExams.slice(0, 5);
    
    const examCount = allExams.length;
    const studentCount = 0; 
    
    const stats = {
        examsCount: examCount,
        submissionsCount: 0,
        averageScore: 0
    };
    
    res.render('teacher-dashboard', {
        user: req.session.user,
        exams: recentExams,
        examCount: examCount, 
        studentCount: studentCount,
        stats: stats, 
        questions: [],
        subjects: [],
        formData: {},
        errors: {},
        success: {}
    });
        } catch (err) {
    console.error('Erreur lors du chargement du tableau de bord:', err);
    
    res.render('teacher-dashboard', {
    user: req.session.user,
    exams: [],
    examCount: 0,
    studentCount: 0,
    stats: {
        examsCount: 0,
        submissionsCount: 0,
        averageScore: 0
    },
    questions: [],
    subjects: [],
    formData: {},
    errors: {},
    success: {}
    });
    }
});

router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;