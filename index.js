const logger = require('loglevel');
const express = require('express');
const passport = require('passport');
const { rateLimit } = require('./app/middleware');
const { connectDB } = require('./app/config');

const app = express();
const PORT = process.env.PORT || 4001;

require('./app/models/User');
require('./app/models/Note');
require('./app/middleware/passport');

connectDB();

app.use(express.json())
app.use(passport.initialize());
app.use(rateLimit);
app.use('/api', require('./app/routes'));

// Handle 404
app.get('*', function(req, res) {
    res.status(404).json({ message: "404: Not Found" });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
