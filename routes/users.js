const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => res.render('login'));

// Register page
router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
	const { name, email, password, confirm_password } = req.body;

	let errors = [];

	// Check required fields
	if (!name || !email || !password || !confirm_password) {
		errors.push({ msg: 'Please fill in all fields' });
	}

	// Check passwords match
	if (password !== confirm_password) {
		errors.push({ msg: 'Passwords do not match' });
	}

	// Check password length
	if (password.length < 6) {
		errors.push({ msg: 'Password should be at least 6 characters' });
	}

	if (errors.length > 0) {
		res.render('register', {
			errors,
			name,
			email,
			password,
			confirm_password
		});
	} else {
		const newUser = new User({
			name,
			email,
			password
		});

		// Hash password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;

				// Set password to hashed
				newUser.password = hash;

				// Save user
				newUser.save()
				.then( user => {
					// Creating flash message
					req.flash('success_msg', 'You are now registered and can log in');
					res.redirect('/users/login')
				})
				.catch(err => console.log('err :>> ', err));
			})
		})
	}
});


module.exports = router;