// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

// Define the User schema
const UserSchema = new Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    // User's email address, must be unique and in a valid format
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    // Password field which will be hashed before saving
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Excludes password from query results by default for security
    },
    // Role-based access control field
    role: {
      type: String,
      enum: ['student', 'admin', 'proctor'],
      default: 'student',
    },
    // Status field to manage account activation or deactivation
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    // Optional field to record the last login date
    lastLogin: {
      type: Date,
    },
  },
  {
    // Automatically include createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Pre-save hook to hash the password before saving the user document.
 * It only hashes the password if it has been newly created or modified.
 */
UserSchema.pre('save', async function (next) {
  // If password is not modified, skip hashing
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt with a cost factor of 10
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare an entered password with the hashed password in the database.
 * This method will be used in the login API to verify user credentials.
 *
 * @param {String} candidatePassword - The plain-text password entered by the user.
 * @returns {Promise<Boolean>} - Returns true if the password matches, otherwise false.
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
