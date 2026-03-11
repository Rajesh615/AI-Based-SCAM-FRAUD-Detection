const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const scamWords = [
"otp",
"urgent",
"bank",
"account blocked",
"click link",
"lottery",
"winner",
"verify now"
];

app.post("/check-scam",(req,res)=>{

const text = req.body.message.toLowerCase();

let score = 0;
let suspicious = [];

scamWords.forEach(word=>{
if(text.includes(word)){
score += 15;
suspicious.push(word);
}
});

if(score > 100) score = 100;

res.json({
probability: score,
suspicious: suspicious,
advice: "Never share OTP or bank details with unknown messages."
});

});

app.listen(4000,()=>{
console.log("Server running on http://localhost:4000");
});