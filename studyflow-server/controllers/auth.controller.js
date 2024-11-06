const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authController = {
    // register new user
    async register(req, res)  {
        try {
            const {email, password, firstName, lastName} = req.body;
            
            // check if user already exists
            const existingUser = await User.findOne({ email});
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists'});
            }

            // create new user
            const user = new User({ email, password, firstName, lastName});
            await user.save();

            // generate JWT token
            const token = jwt.sign(
                { id: user._id},
                process.env.JWT_SECRET,
                { expiresIn: '1d'}
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

        
    },

    // login user
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials'});
            }

            // check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials'});
            }

            // generate JWT token
            const token = jwt.sign(
                { id: user._id},
                process.env.JWT_SECRET,
                { expiresIn: '1d'}
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },

    // get current user profile
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;