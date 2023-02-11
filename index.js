// Import packages
const express = require("express");
const home = require("./routes/home");
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: 'hattie.db.elephantsql.com',
    port: 5432,
    user: 'plcwwdix',
    password: 'IW2fq8188nBZTNRTdxT-_bKFCwkh2FbR',
    database: 'plcwwdix'
  }
});



// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/home", home);



///jag har lag till////
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


/////Get all info att startup/////
app.put('/allinfo', (req, res) => {
  const id = req.params
  db.select('*').from('recept').orderBy('betyg')
    .where('id' !== '')
    .then(allInfo => {
      res.json(allInfo)
    })
})

//////Lägg till ny ///////
app.post('/allinfo', (req, res) => {
  db('recept').insert({
    maträtt: req.body.maträtt,
    recept: req.body.recept,
    kommentar: req.body.kommentar,
    betyg: req.body.betyg,
    namn: req.body.namn,
    totalabetygpoang: req.body.totalabetygpoang,
    mattyp: req.body.mattyp,
    datum: new Date()
  })
    .then(function () {
      db.select().from('recept')
        .then(allMessage => {
          res.json(allMessage)
        })
    })
})


app.delete('/allinfo/:id', (req, res) => {
  db('recept')
    .where('id', req.params.id)
    .del()
    .then(x => {
      res.json({ succsess: true })
    })
})


/////Hämta 1 id /////
app.put('/id', (req, res) => {
  const id = req.params
  db.select('*').from('recept')
    .where('id', req.body.id)
    .then(allInfo => {
      res.json(allInfo)
    })
})

//// Update Betyg /////
app.put('/updatebetyg', (req, res) => {
  const { id } = req.body;
  db('recept').where('id', '=', id)
    .increment('antalbetyg', 1)
    .update({
      betyg: req.body.betyg,
      totalabetygpoang: req.body.totalabetygpoang
    })
    .returning('antalbetyg')
    .then(antalbetyg => {
      res.json(antalbetyg[0].antalbetyg);
    })
    .catch(err => res.status(400).json('Error'))
})


/////////LOGGA IN /////////////////
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

///////////REGISTISTRERA NY ANVÄNDARE //////////
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email,
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name: name,
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json("already registred"))
})


// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
//
