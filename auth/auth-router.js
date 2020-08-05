const router = require('express').Router();
const Users = require('../users/users-model');
const bcrypt = require('bcryptjs');

/* ----- POST /api/auth/register ----- */
router.post('/register', async (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  try {
    const saved = await Users.add(user);
    res.status(201).json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

/* ----- POST /api/auth/login ----- */
router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `welcome ${user.username}` });
      } else {
        res.status(401).json({ message: 'invalid creds' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

/* ----- GET /api/auth/logout ----- */
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.send('you can checkout but you can never leave...');
      } else {
        res.send('so long and thanks for all the fish...');
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
