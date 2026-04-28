const User = require('../models/user');

const authController = {
    getLoginPage: (req,res) => {
      let errorMessage = '';
      let successMessage = '';
      let formData = {};

      if(typeof req.flash ==='function') {
        errorMessage = req.flash('error') || '';
        successMessage = req.flash('success') || '';
        formData = req.flash('formData')[0] || {};
      }
      res.render('login' ,{
        title : 'Login - Online Examination System',
        errorMessage,
        successMessage,
        formData
      })
    },

    getRegisterPage: (req,res) => {
      errorMessage = '';
      let formaData = {};

      if(typeof req.flash ==='function') {
        errorMessage = req.flash('error') || '';
        formData = req.flash('formData')[0] || {};
      }else if (req.session) {
        errorMessage = req.session.error || '';
        formData = req.session.formData || {};
        delete req.session.error;
        delete req.session.formData;
      }
      res.render('register' ,{
        title : 'Register - Online Examination System',
        errorMessage,
        formData
      })
      },

    login: async (req,res) => {
      const { email, password } = req.body;
      try {
        const user =await User.findOne({ email });
        if (!user || await user.comparePassword(password) === false) {
          console.log('Invalid email or password');
          if (typeof req.flash === 'function') {
            req.flash('error', 'Invalid email or password');
            req.flash('formData', { email });
          } else if (req.session) {
            req.session.error = 'Invalid email or password';
            req.session.formData = { email };
          }
          return res.redirect('/login');
        }
        console.log('Login successful' ,email);
        if (typeof req.flash === 'function') {
          req.flash('success', 'Login successful');
        } else if (req.session) {
          req.session.success = 'Login successful';
        }
        req.session.userId = {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: `${user.firstName} ${user.lastName}`
        };

        const redirectUrl = user.role === 'student' ? '/student-dashboard' : '/teacher-dashboard';
        res.redirect(redirectPath);  
      }catch (error) {
        console.error('Error during login:', error);

        if(typeof req.flash ==='function'){
          req.flash('error', 'An error occurred during login: ' + error.message);
        req.flash('formData', { email });
        } else if(req.session) {
          req.session.loginError = 'An error occurred during login: ' + error.message;
          req.session.formData = { email };
        }
        return res.redirect('/login');
      }
    },

  register: async (req, res) => {
    try {
      console.log('Request body:', req.body);
      if (!req.body) {
        console.error('req.body is undefined');
        
        if (typeof req.flash === 'function') {
          req.flash('error', 'No form data received');
        } else if (req.session) {
          req.session.registerError = 'No form data received';
        }
        
        return res.redirect('/register');
      }
      
      const { 
        nom, 
        prenom, 
        dateNaissance, 
        sexe, 
        etablissement, 
        filiere, 
        email, 
        password, 
        confirmPassword, 
        typeUtilisateur
      } = req.body;
      
      const role = typeUtilisateur === 'enseignant' ? 'teacher' : 'student';
      
      const terms = req.body.terms === 'on' || req.body.terms === true;
      
      const formDataObj = { 
        nom, 
        prenom, 
        dateNaissance, 
        sexe, 
        etablissement, 
        filiere, 
        email, 
        typeUtilisateur
      };
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMsg = errors.array()[0].msg;
        if (typeof req.flash === 'function') {
          req.flash('error', errorMsg);
          req.flash('formData', formDataObj);
        } else if (req.session) {
          req.session.registerError = errorMsg;
          req.session.formData = formDataObj;
        }
        return res.redirect('/register');
      }
  
      if (password !== confirmPassword) {
        if (typeof req.flash === 'function') {
          req.flash('error', 'Passwords do not match');
          req.flash('formData', formDataObj);
        } else if (req.session) {
          req.session.registerError = 'Passwords do not match';
          req.session.formData = formDataObj;
        }
        return res.redirect('/register');
      }
  
      if (!terms) {
        if (typeof req.flash === 'function') {
          req.flash('error', 'You must agree to the Terms of Service');
          req.flash('formData', formDataObj);
        } else if (req.session) {
          req.session.registerError = 'You must agree to the Terms of Service';
          req.session.formData = formDataObj;
        }
        return res.redirect('/register');
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (typeof req.flash === 'function') {
          req.flash('error', 'Email is already registered');
          req.flash('formData', formDataObj);
        } else if (req.session) {
          req.session.registerError = 'Email is already registered';
          req.session.formData = formDataObj;
        }
        return res.redirect('/register');
      }
  
      const user = await new User({
        nom,
        prenom,
        dateNaissance,
        sexe,
        etablissement,        
        institution: etablissement,  
        filiere,
        email,
        password,
        role 
      }).save();
      
      if (typeof req.flash === 'function') {
        req.flash('success', 'Registration successful! Please login.');
      } else if (req.session) {
        req.session.loginSuccess = 'Registration successful! Please login.';
      }
      
      return res.redirect('/login');
  
    } catch (error) {
      console.error('Registration error:', error);
      
      if (typeof req.flash === 'function') {
        req.flash('error', 'An error occurred during registration: ' + error.message);
      } else if (req.session) {
        req.session.registerError = 'An error occurred during registration: ' + error.message;
      }
      
      return res.redirect('/register');
    }
  },
    logout: (req,res) => {
      req.session.destroy(err => {
        if(err){
          console.error('logout error ', err)
        }
        res.redirect('/login');
      })
    }
};

module.exports = authController;
