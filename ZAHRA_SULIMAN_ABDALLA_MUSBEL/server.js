const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDB = require('./database');
const Beneficiary = require('./models/Beneficiary');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API route to handle form registration
app.post('/api/register', async (req, res) => {
    const { 
        firstName, lastName, dateOfBirth, gender,
        nationality, maritalStatus, placeOfBirth,
        settlementCamp, dateOfJoining 
    } = req.body;

    // Server-side validation (basic)
    if (!firstName || !lastName || firstName.length < 2 || lastName.length < 2 || placeOfBirth.length < 2) {
        return res.status(400).json({ error: 'Validation failed: Names and place of birth must be at least 2 chars.' });
    }

    try {
        // Create a new document instance using the Mongoose Beneficiary model
        // We pass in all the data extracted from the incoming request body
        const newBeneficiary = new Beneficiary({
            firstName, 
            lastName, 
            dateOfBirth, 
            // Fallback to 'female' default if not provided, per business rules
            gender: gender || 'female',
            nationality, 
            maritalStatus, 
            placeOfBirth,
            settlementCamp, 
            dateOfJoining
        });

        // Save the document to the MongoDB database asynchronously
        const savedBeneficiary = await newBeneficiary.save();
        
        // Return a successful 200 response with the newly generated MongoDB ID (_id)
        res.status(200).json({ message: 'Beneficiary registered successfully!', id: savedBeneficiary._id });
    } catch (err) {
        // Log the exact error to the server console and send a generalized error message safely back to the client
        console.error('Error saving to MongoDB:', err.message);
        res.status(500).json({ error: 'Failed to register beneficiary.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
