const express = require('express');
const mongoose = require('mongoose');
const dotenv=require('dotenv')
const cors = require('cors')
bodyParser = require('body-parser'),
jsonwebtoken = require("jsonwebtoken");
dotenv.config();
const app = express();

Admin = require('./models/adminModel');
Doctor = require('./models/doctorModel');




//Connection to database
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(`DB connection error: ${err.message}`));

  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));


var adminRoutes = require('./Routes/adminRoute');
var doctorRoutes = require('./Routes/doctorRoute');
var patientRoutes = require('./Routes/patientRoute');
var appointmentRoute = require('./Routes/appointmentsRoute');
var usersRoute = require('./Routes/usersRoute');
app.use("/admin", adminRoutes)
app.use("/doctor", doctorRoutes);
app.use("/patient" , patientRoutes);
app.use("/users", usersRoute);
app.use("/appointment" ,appointmentRoute )
//Running server
app.listen(process.env.PORT ,()=>{
    console.log(`server is running on port ${process.env.PORT}`)

});
