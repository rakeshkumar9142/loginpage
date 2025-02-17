const mongoose = require("mongoose");

// Update the connection string if necessary
mongoose.connect("mongodb://localhost:27017")
  .then(() => {
    console.log('mongoose connected');
  })
  .catch((e) => {
    console.log('failed to connect', e);
  });

  const logInSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true // Ensure the email is unique
    },
    phone_number: {
      type: String, // Changed to String to match the input type
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    confirm_password: {
      type: String,
      required: true
    }
  });
  
  // Pre-save hook to validate password and confirm_password
  logInSchema.pre('save', async function (next) {
    if (this.password !== this.confirm_password) {
      return next(new Error('Passwords do not match'));
    }
    next();
  });
  


const LogInCollection = new mongoose.model('LogInCollection', logInSchema);

module.exports = LogInCollection;