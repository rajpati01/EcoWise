
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');


const app = express();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 EcoWise server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
})