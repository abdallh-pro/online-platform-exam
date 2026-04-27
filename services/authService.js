const User = require('../models/user');

const authController = {
    getLoginPage: (req,res) => {},

    getRegisterPage: (req,res) => {},

    login: async (req,res) => {},

    register: async (req,res) => {},

    // the easy function 
    logout: (req,res) => {}
};

module.exports = authController;

TODO - MASTER AUTH CONTROLLER (JAVASCRIPT FULL STACK)

GOAL:
Be able to write login, register, logout controller from scratch without copying code.

------------------------------------------------------------
DAY 1 - UNDERSTAND STRUCTURE
------------------------------------------------------------
Tasks:
- Read the full auth controller file
- Identify main functions:
  - getLoginPage
  - getRegisterPage
  - login
  - register
  - logout

Write for each function:
- What does it do? (1 sentence)

List important patterns:
- req.body
- req.session
- res.render
- res.redirect
- User.findOne
- User.save
- validationResult

------------------------------------------------------------
DAY 2 - PAGE RENDERING ONLY
------------------------------------------------------------
Tasks:
- Write getLoginPage from memory
- Write getRegisterPage from memory

Rules:
- Only res.render
- Only title + basic data
- NO database logic

------------------------------------------------------------
DAY 3 - LOGOUT + SESSION
------------------------------------------------------------
Tasks:
- Write logout function from memory:
  - destroy session
  - redirect login

- Test session manually:
  - set req.session.user
  - print it

------------------------------------------------------------
DAY 4 - LOGIN LOGIC (STEP BY STEP)
------------------------------------------------------------
Break login into small steps:

Step 1: get email/password from req.body
Step 2: find user in database
Step 3: check if user exists
Step 4: compare password
Step 5: create session
Step 6: redirect dashboard

Rules:
- Write step by step only
- Do NOT write full function at once

------------------------------------------------------------
DAY 5 - REGISTER LOGIC (STEP BY STEP)
------------------------------------------------------------
Break register into:

Step 1: get form data
Step 2: check empty fields
Step 3: check password match
Step 4: check if user exists
Step 5: create user in database
Step 6: redirect login page

------------------------------------------------------------
DAY 6 - VALIDATION + ERROR HANDLING
------------------------------------------------------------
Tasks:
- Add express-validator check
- Handle errors properly
- Store errors in session or flash
- Send back form data

------------------------------------------------------------
DAY 7 - FULL REBUILD CHALLENGE
------------------------------------------------------------
Tasks:
- Rewrite full auth controller from memory:
  - login page
  - register page
  - login logic
  - register logic
  - logout

Rules:
- No copying
- No tutorial
- Only memory

------------------------------------------------------------
DAY 8 - DEBUG PRACTICE
------------------------------------------------------------
Tasks:
- Break your own code intentionally
- Fix errors alone
- Common mistakes:
  - wrong field names
  - missing await
  - wrong redirect
  - undefined req.body

------------------------------------------------------------
DAY 9 - SPEED CODING
------------------------------------------------------------
Tasks:
- Write login + register in 30 minutes
- No pause, no searching

------------------------------------------------------------
DAY 10 - MINI PROJECT
------------------------------------------------------------
Build:
- register user
- login user
- dashboard redirect
- logout system

Rules:
- No full reference code
- Only your memory

------------------------------------------------------------
RULES FOR ALL DAYS
------------------------------------------------------------
- NEVER copy full controller
- ALWAYS break into small steps
- WRITE ugly first, then improve
- THINK: one function at a time
- PRACTICE daily writing, not reading

AUTH CONTROLLER - SMALL TASK BREAKDOWN (JAVASCRIPT FULL STACK)

GOAL:
Rebuild each function step by step WITHOUT copying full code.

============================================================
1. getLoginPage(req, res)
============================================================

SMALL TASKS:
- Create function getLoginPage
- Create default variables:
  - errorMessage
  - successMessage
  - formData

- Check if req.flash exists:
  - If yes:
    - get error message from flash
    - get success message from flash
    - get formData from flash
  - If no:
    - set empty default values

- Render login page:
  - res.render("login")
  - pass:
    - title
    - errorMessage
    - successMessage
    - formData

============================================================
2. getRegisterPage(req, res)
============================================================

SMALL TASKS:
- Create function getRegisterPage
- Create default variables:
  - errorMessage
  - formData

- Check if req.flash exists:
  - If yes:
    - get error message
    - get formData
  - If no:
    - check req.session
      - get registerError
      - get formData
      - delete session data after use

- Log debug message (optional)

- Render register page:
  - res.render("register")
  - pass:
    - title
    - errorMessage
    - formData
    - errors: []

============================================================
3. login(req, res)
============================================================

SMALL TASKS:

STEP 1: GET DATA
- extract email from req.body
- extract password from req.body

STEP 2: FIND USER
- search user in DB by email

STEP 3: CHECK USER EXISTS
- if user NOT found:
  - send error (flash or session)
  - redirect /login

STEP 4: CHECK PASSWORD
- call user.comparePassword(password)

STEP 5: IF PASSWORD WRONG
- send error message
- store email in formData
- redirect /login

STEP 6: SUCCESS LOGIN
- create session:
  - user id
  - email
  - role
  - fullName

STEP 7: REDIRECT
- if role is student:
  - redirect /student-dashboard
- else:
  - redirect /teacher-dashboard

STEP 8: ERROR HANDLING
- wrap everything in try/catch
- on error:
  - store error message
  - redirect /login

============================================================
4. register(req, res)
============================================================

SMALL TASKS:

STEP 1: CHECK req.body
- if undefined:
  - return error
  - redirect /register

STEP 2: EXTRACT DATA
- nom
- prenom
- dateNaissance
- sexe
- etablissement
- filiere
- email
- password
- confirmPassword
- typeUtilisateur

STEP 3: MAP ROLE
- if typeUtilisateur == "enseignant":
  - role = "teacher"
- else:
  - role = "student"

STEP 4: TERMS CHECK
- check if terms accepted

STEP 5: EXPRESS VALIDATION
- get validationResult(req)
- if errors exist:
  - send error
  - redirect /register

STEP 6: PASSWORD MATCH
- if password != confirmPassword:
  - send error
  - redirect /register

STEP 7: CHECK EMAIL EXISTS
- find user by email
- if exists:
  - send error
  - redirect /register

STEP 8: CREATE USER
- create new User with:
  - nom
  - prenom
  - dateNaissance
  - sexe
  - etablissement
  - filiere
  - email
  - password
  - role

STEP 9: SUCCESS RESPONSE
- send success message
- redirect /login

STEP 10: ERROR HANDLING
- catch error
- send error message
- redirect /register

============================================================
5. logout(req, res)
============================================================

SMALL TASKS:
- create logout function
- destroy session:
  - req.session.destroy()

- handle error if exists

- redirect to /login

============================================================
FINAL RULES
============================================================

- NEVER write full function at once
- ALWAYS build step-by-step
- ALWAYS test mentally each step
- ONE function = ONE small problem
- IF stuck → go back to steps, not full code