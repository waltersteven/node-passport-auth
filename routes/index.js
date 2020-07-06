const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard page (contains ensureAuthenticated middleware).
router.get('/dashboard', ensureAuthenticated, (req, res) => 

res.render('dashboard', {
	name: req.user.name
}));

module.exports = router;