const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
    const {username, password} = req.headers;

    const admin = ADMINS.find(a => a.username === username && a.password === password);
    if(admin){
      next();
    }else{
      res.status(403).json({message: "Admin authentication failed"});
    }
};

const userAuthentication = (req, res, next) =>{
  const{username, password} = req.headers;

  const user = USERS.find(a => a.username === username && a.password === password);
  if(user){
    next();
  }else{
    res.status(400).json({message: "User authentication failed"});
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username ===admin.username);
  if(existingAdmin){
    res.status(403).json("Admin already exists");
  }else{
    ADMINS.push(admin);
    res.status(200).json("Admin created successfully");
  }
});

app.post('/admin/login',adminAuthentication, (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username && a.password === admin.password)
  if(existingAdmin){
    res.status(200).json("Login Successful")
  }else{
    res.status(403).json("Autorization Failed");
  }
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  const course = req.body;

  course.id = Date.now(); // use timestamp as course ID
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});


app.put('/admin/courses/:courseId',adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(a => courseId === a.id);
  if(course){
    Object.assign(course, req.body);
    res.status(200).json({message: "Courses updated successfully"});
  }else{
    res.status(404).json({message: "Course not found"});
  }
});

app.get('/admin/courses',adminAuthentication, (req, res) => {
  const courses = req.body;
  const existingCourses = COURSES.find(a => a.id === courses.id);
  if(existingCourses){
    res.status(200).json(existingCourses);
  }else{
    res.status(400).send("Course not found");
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  const users = req.body;
  const existingUser = USERS.find(a => a.username === users.username);
  if(existingUser){
    res.status(403).json("User already exist");
  }else{
    USERS.push(users);
    res.status(200).json("SignUp Successful");
  }
});

app.post('/users/login',userAuthentication, (req, res) => {
  const user = req.body;
  const existingUser = USERS.find(a => a.username ===  user.username && a.password === user.password);
  if(existingUser){
    res.status(200).json("User Login Successful");
  }else{
    res.status(403).json("Autorization Failed");
  }
});

app.get('/users/courses',userAuthentication, (req, res) => {
  res.json({courses: COURSES});
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
