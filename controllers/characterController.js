const Character = require('../models/character');

exports.createCharacter = async (req, res) => {
    const { username, name, class: charClass, race, spec, description, items, talents, points, professions, glyphs } = req.body;
    try {
        const newCharacter = new Character({
            username,
            name,
            class: charClass,
            race,
            spec,
            description,
            items,
            talents,
            points,
            professions,
            glyphs
        });
        
        await newCharacter.save();
        res.status(201).json(newCharacter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCharacters = async (req, res) => {
    try {
        const characters = await Character.find();
        res.json(characters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCharacter = async (req, res) => {
    const { id } = req.params;
    const { name, class: charClass, race, spec, description, items, talents, points, professions, glyphs } = req.body;

    try {
        const updatedCharacter = await Character.findByIdAndUpdate(id, {
            name,
            class: charClass,
            race,
            spec,
            description,
            items,
            talents,
            points,
            professions,
            glyphs
        }, { new: true });

        if (!updatedCharacter) {
            return res.status(404).json({ message: 'Char não encontrado' });
        }

        res.json(updatedCharacter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCharacter = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCharacter = await Character.findByIdAndDelete(id);

        if (!deletedCharacter) {
            return res.status(404).json({ message: 'Char não encontrado' });
        }

        res.json({ message: 'Char deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCharacterById = async (req, res) => {
    const { id } = req.params;

    try {
        const character = await Character.findById(id);

        if (!character) {
            return res.status(404).json({ message: 'Char não encontrado' });
        }

        res.json(character);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
