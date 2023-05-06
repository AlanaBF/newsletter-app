require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

//allows the server to serve up static files saved in a folder not with a URL
app.use(express.static(__dirname + "/public"));
//bodyParser allows us to grab the data from the sign up form
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  //requires the first name, last name and email from the body of the html document
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  let data = {
    //member key value pairs for everyone who signs up to the newsletter
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  let jsonData = JSON.stringify(data);
const DC = process.env.dc;
const ID = process.env.id;

const url = "https://" + DC+ ".api.mailchimp.com/3.0/lists/" + ID + "";

  const API_KEY = process.env.apikey;

  const options = {
    method: "POST",
    auth: "alana:" + API_KEY + ""
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});


//redirects to the home page if the sign in fails
app.post("/failure", function(req, res) {
  res.redirect("/");
});

//specify to listen on localhost:3000
app.listen(3000, function () {
  console.log("Server is running on 3000");
});