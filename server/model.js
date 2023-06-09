const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Nitikorn_data", {
    useNewUrlParser: true, //เป็นข้อบังคับของ MongoDB
    useUnifiedTopology: true, //เป็นข้อบังคับของ MongoDB
})
    .then((result) => console.log("Connection OK"))
    .catch((err) => console.log(err));

let studentSchema = new mongoose.Schema({
    stdId: String,
    stdName: String,
    stdGrade: Number
})
let Student = mongoose.model("Student", studentSchema)
module.exports = Student
