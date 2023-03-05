const router = require('express').Router();
const passport = require('passport');
const { notesController } = require('../controllers');
const { rateLimiter } = require('../middleware/rateLimiter')
const passportOpts = { session: false };

router.post('/notes', passport.authenticate('jwt', passportOpts), notesController.createNote);
router.get('/notes', passport.authenticate('jwt', passportOpts), notesController.getNotes);
router.get('/notes/:id', passport.authenticate('jwt', passportOpts), notesController.getNoteById);
router.put('/notes/:id', passport.authenticate('jwt', passportOpts), notesController.updateNoteById);
router.delete('/notes/:id', passport.authenticate('jwt', passportOpts), notesController.deleteNoteById);
router.post('/notes/:id/share', passport.authenticate('jwt', passportOpts), notesController.shareNote);
router.get('/search', passport.authenticate('jwt', passportOpts), notesController.searchNotes);

module.exports = router;