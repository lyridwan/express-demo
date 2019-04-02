const express = require("express");
const Joi = require("joi");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "Course One" },
  { id: 2, name: "Course Two" },
  { id: 3, name: "Course Three" }
];

// HTTTP GET REQUEST
// HOME
app.get("/", (req, res) => {
  res.send("Hello World");
});

// GET ALL
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// GET BY ID
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send("The course with the given ID was not found...");

  res.send(course);
});

// HTTP POST REQUEST
//
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  courses.push(course);
  res.send(courses);
});

// HTTP PUT REQUEST
app.put("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given ID was not found...");

  // Validate
  //If invalid, return 400 - Bad Request

  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
});

// HTTP PUT REQUEST
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send("The course with the given ID was not found...");

  // Validate
  //If invalid, return 400 - Bad Request
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
}

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
