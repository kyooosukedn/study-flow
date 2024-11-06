const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
      },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
      },
    settings: {
        dailyGoalHours: {
        type: Number,
        default: 4
    },
    preferredStudyDuration: {
        type: Number,
        default: 25 
    },
    breakDuration: {
        type: Number,
        default: 5  // 5 minutes
    }
}
}, 
    {
        timestamps: true
    }
);

// Hash password before saving to database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
});

// check password validity
userSchema.methods.comparePassword = async function(candidatePassword, next) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
