require('dotenv').config();
const express = require("express");
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');

var cors = require('cors')
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Cite = require("citation-js");

const cookieParser = require("cookie-parser")

const fileUpload = require('express-fileupload')
const mongodb = require('mongodb')
const fs = require('fs')
const router = express.Router()
const mongoClient = mongodb.MongoClient
const binary = mongodb.Binary
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(
  "mongodb+srv://adityakes321:aditya@cluster0.mv35f.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true},
  () => console.log(" Mongoose is connected")
);

const bookSchema = {
  IEEE_reference: String,//
  unique_id: String,//
  title_of_paper: String,//
  name_of_authors: String,//
  //name_of_journal: String,//
  publication_year: Number,//
  ISSN_number: String,//
  //link_of_recognition: String,//
  journal_type: String,//
  month_of_publication: String,//
  name_of_publisher: String,//
  affiliating_institute: String,//
  google_scholar_citation_count: Number,//
  indexed_in_scopus: String,
  journal_h_index: String,//
  co_author: String,//
  DOI_of_paper: String,//
};
const journalsSchema = {
  IEEE_reference: String,
  unique_id: String,
  title_of_paper: String,
  name_of_authors: String,
  name_of_journal: String,
  publication_year: Number,
  ISSN_number: String,
  link_of_recognition: String,
  journal_type: String,
  month_of_publication: String,
  google_scholar_citation_count: Number,
  impact_factor: String,
  journal_h_index: String,
  indexing: {
    scopus: { type: String, default: false },
    sci: { type: String, default: false },
    other: { type: String, default: false },
  },
  co_author: String,
  DOI_of_paper: String,
};

const conferenceSchema = {
  IEEE_reference: String,
  unique_id: String,
  title_of_paper: String,
  name_of_authors: String,
  title_of_proceedings: String,
  name_of_conference: String,
  conference_type: String,
  publication_year: Number,
  ISSN_ISBN_number: String,
  affiliate_institute: String,
  name_of_publisher: String,
  month_of_publication: String,
  indexed_in_scopus: String,
  scopus_citation_count: String,
  google_scholar_citation_count: String,
  conference_h_index: String,
  co_author: String,
  DOI_of_paper: String,
};

const referenceSchema = {
  DOI_of_paper: String,
  IEEE_reference: String,
  unique_id: String,
  title_of_paper: String,
  name_of_authors: String,
  name_of_publisher: String,
  ISSN_ISBN_number: String,
  publication_year: Number,
  co_author: String,
  google_scholar_citation_count: Number,
};

const patentSchema ={
 patent_status: String,
 is_principal_inventor: String,
 inventor_name: String,
 other_inventors: String,
 patent_title: String,
 application_patent_number: Number,
 application_award_date: String,
 patent_awarded_country: String,
 unique_id: String,
};



const journals = mongoose.model("journals", journalsSchema);
const conferences = mongoose.model("conferences", conferenceSchema);
const books = mongoose.model("books", bookSchema);
const references = mongoose.model("references", referenceSchema);
const patents = mongoose.model("patents", patentSchema);

const registrationSchema = {
  username: {
    type: String,
    unique: true,
  },
  email: String,
  password: String,
};
const registers = mongoose.model("registers", registrationSchema);

app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.render("index");
});


// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}


// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

app.get('/homepage', function (req,res) {
  res.render('homepage');
})
app.get('/homepage', isLoggedIn, function (req,res) {
  res.render('homepage');
  });

app.post("/", async function (req, res) {
  try {
    const user = req.body.Username;
    const pass = req.body.Password;
    console.log(`Username is ${user} and password is ${pass}`);

    const username = await registers.findOne({ username: user });
    console.log(username);

    if (username.password === pass) {
      res.redirect("/homepage");
    } else {
      res.send("invalid details");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});
// app.get("/homepage", (req, res) => {
//   res.sendFile(__dirname + "/views/homepage.html");
// });

app.get("/inputFile", (req, res) => {
  res.sendFile(__dirname + "/input_components/file_input.html");
});

app.get("/citation-data/", cors(), (req, res) => {
  const doi = req.query.doi
  console.log(doi)
  var data = new Cite(doi);

  data.get({
    formats: "json",
    type: "html",
    style: "citation-apa",
    lang: "en-US",
  });
  console.log(data.data);
  res.json(data.data);

//   const bib = data.format('bibliography', {
//   format: 'text',
//   template: 'apa',
//   lang: 'en-US'
// });


});

app.post("/register", function (req, res) {
  let newRegister = new registers({
    username: req.body.u,
    email: req.body.e,
    password: req.body.p,
  });
  newRegister.save();
  res.redirect("/");
});



app.post("/journal", function (req, res) {
  let newJournal = new journals({
    IEEE_reference: req.body.fir,
    unique_id: req.body.ui,
    title_of_paper: req.body.top,
    name_of_authors: req.body.nofa,
    name_of_journal: req.body.noj,
    publication_year: req.body.py,
    ISSN_number: req.body.in,
    link_of_recognition: req.body.lor,
    journal_type: req.body.jt,
    month_of_publication: req.body.mop,
    google_scholar_citation_count: req.body.gscc,
    impact_factor: req.body.if,
    journal_h_index: req.body.jhi,
    indexing: {
      scopus: req.body.s,
      sci: req.body.sss,
      other: req.body.o,
    },
    co_author: req.body.ca,
    DOI_of_paper: req.body.dop,
    file: req.body.utp,
  });
  newJournal.save();
  res.redirect("/homepage");
});

app.post("/bookChapter", function (req, res) {
  let newBook = new books({
    IEEE_reference: req.body.fir,//
    unique_id: req.body.ui,//
    title_of_paper: req.body.top,//
    name_of_authors: req.body.nofa,//
    //name_of_journal: String,//
    publication_year: req.body.py,//
    ISSN_number: req.body.in,//
    //link_of_recognition: String,//
    journal_type: req.body.jt,//
    month_of_publication: req.body.mop,//
    name_of_publisher: req.body.nop,//
    affiliating_institute: req.body.aitp,//
    google_scholar_citation_count: req.body.gscc,//
    indexed_in_scopus: req.body.is,
    journal_h_index: req.body.jhi,//
    co_author: req.body.ca,//
    DOI_of_paper: req.body.dop,//
  });
  newBook.save();
  res.redirect("/homepage");
});

app.post("/reference", function (req, res) {
  let newReference = new references({
    DOI_of_paper: req.body.dop,
    IEEE_reference: req.body.fir,
    unique_id: req.body.ui,
    title_of_paper: req.body.top,
    name_of_authors: req.body.nofa,
    name_of_publisher: req.body.nop,
    ISSN_ISBN_number: req.body.in,
    publication_year: req.body.py,
    co_author: req.body.ca,
    google_scholar_citation_count: req.body.gscc,
  });
  newReference.save();
  res.redirect("/homepage");
});

app.post("/conference", function (req, res) {
  let newConference = new conferences({
    IEEE_reference: req.body.fir,
    unique_id: req.body.ui,
    title_of_paper: req.body.top,
    name_of_authors: req.body.nofa,
    title_of_proceedings: req.body.topc,
    name_of_conference: req.body.noc,
    conference_type: req.body.ct,
    publication_year: req.body.py,
    ISSN_ISBN_number: req.body.in,
    affiliate_institute: req.body.aitp,
    name_of_publisher: req.body.nop,
    month_of_publication: req.body.mop,
    indexed_in_scopus: req.body.iis,
    scopus_citation_count: req.body.scc,
    google_scholar_citation_count: req.body.gscc,
    conference_h_index: req.body.chi,
    co_author: req.body.ca,
    DOI_of_paper: req.body.dop,
  });
  newConference.save();
  res.redirect("/homepage");
});

app.post("/patent", function (req, res) {
  let newPatent = new patents({
    patent_status: req.body.ps,
    is_principal_inventor: req.body.pi,
    inventor_name: req.body.in,
    other_inventors: req.body.oi,
    patent_title: req.body.pt,
    application_patent_number: req.body.pn,
    application_award_date: req.body.ad,
    patent_awarded_country: req.body.pac,
    unique_id: req.body.uid,
  });
  newPatent.save();
  res.redirect("/homepage");
});


app.use(fileUpload())

app.post("/upload", (req, res) => {
    let file = { name: req.body.name, file: binary(req.files.uploadedFile.data) }
    insertFile(file, res)
})

function insertFile(file, res) {
    mongoClient.connect("mongodb+srv://adityakes321:aditya@cluster0.mv35f.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true }, (err, client) => {
        if (err) {
            return err
        }
        else {
            let db = client.db('test')
            let collection = db.collection('files')
            try {
                collection.insertOne(file)
                console.log('File Inserted')
            }
            catch (err) {
                console.log('Error while inserting:', err)
            }
            // res.redirect('/homepage');
        }

    })
}





// Example protected and unprotected routes
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/homepage');
}
);

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})


app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});

