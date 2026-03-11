async function checkScam(){

const message = document.getElementById("message").value;

if(message === ""){
alert("Please paste a message");
return;
}

const response = await fetch("/check-scam",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message})
});

const data = await response.json();

let color = "green";

if(data.probability > 60){
color = "red";
}
else if(data.probability > 30){
color = "orange";
}

document.getElementById("result").innerHTML = `
<h2 style="color:${color}">Scam Probability: ${data.probability}%</h2>

<p><b>Suspicious Words:</b> ${data.suspicious.join(", ")}</p>

<p><b>Advice:</b> ${data.advice}</p>
`;

}