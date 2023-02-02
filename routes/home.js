const express = require("express");
const router = express.Router();

// const app = express();
// const bcrypt = require('bcrypt-nodejs');
// const cors = require('cors');
// const knex = require('knex');

// const db = knex({
//   client: 'pg',
//   connection: {
//     host: 'hattie.db.elephantsql.com',
//     port: 5432,
//     user: 'plcwwdix',
//     password: 'IW2fq8188nBZTNRTdxT-_bKFCwkh2FbR',
//     database: 'plcwwdix'
//   }
// });

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cors());


// app.get('/', (req, res) => {
//   res.send('ok');
// })

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});




module.exports = router;
