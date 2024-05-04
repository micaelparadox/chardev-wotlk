const express = require('express');
const router = express.Router();
const {
    createCharacter,
    getCharacters,
    updateCharacter,
    deleteCharacter,
    getCharacterById
} = require('../controllers/characterController');

router.post('/', createCharacter);
router.get('/', getCharacters);
router.get('/:id', getCharacterById);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

module.exports = router;
