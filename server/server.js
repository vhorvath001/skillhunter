const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;
// const initDB = require('./config/initDB');

// built-in middleware for JSON
app.use(express.json());

// routes
app.use('/extraction', require('./routes/api/extractionRoute'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // initDB();
});