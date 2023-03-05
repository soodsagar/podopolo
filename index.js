const logger = require('loglevel');
const connectDB = require('./app/config/db');
const express = require('express');
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 4001;

require('./app/models/User');
require('./app/models/Note');
require('./app/config/passport');

connectDB();

app.use(express.json())
app.use(passport.initialize());
app.use('/api', require('./app/routes'));

// Handle 404
app.get('*', function(req, res) {
    res.status(404).json({ message: "404: Not Found" });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
