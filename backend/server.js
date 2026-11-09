const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mfa-project';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('Database connection error:', err));

// 1. Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// 2. MFA Generate Route
app.post('/api/mfa/generate', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const secret = speakeasy.generateSecret({ name: `MFA App (${email})` });

        user.mfaSecret = secret.base32;
        await user.save();

        QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to generate QR code' });
            }

            res.json({
                message: 'MFA secret generated successfully!',
                secret: secret.base32,
                qrCodeUrl: dataUrl
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during MFA generation.' });
    }
});

// 3. MFA Verify Route
app.post('/api/mfa/verify', async (req, res) => {
    try {
        const { email, token } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'MFA not initialized for this user' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (!verified) {
            return res.status(400).json({ error: 'Invalid MFA code. Please try again.' });
        }

        user.isMfaEnabled = true;
        await user.save();

        res.json({ message: 'MFA verified and enabled successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during MFA verification.' });
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { email, password, token } = req.body;
    //1
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    //validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    //verify MFA token
    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 1
    });

    if(!verified)
{
    return res.status(400).json({ error: 'Invalid MFA code' });
}
    //success
    res.status(200).json({ message: 'Login successful with MFA' , userId: user._id});
}
catch (error){
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
}

});

 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});