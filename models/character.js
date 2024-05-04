const mongoose = require("mongoose");

const CharSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  race: String,
  spec: String,
  description: String,
  talents: {},
  points: {},
  professions: {},
  glyphs: {},
  items: {
    head: { item: Object, gems: Object, enchant: Object },
    neck: { item: Object, gems: Object, enchant: Object },
    shoulders: { item: Object, gems: Object, enchant: Object },
    back: { item: Object, gems: Object, enchant: Object },
    chest: { item: Object, gems: Object, enchant: Object },
    wrist: { item: Object, gems: Object, enchant: Object },
    hands: { item: Object, gems: Object, enchant: Object },
    waist: { item: Object, gems: Object, enchant: Object },
    legs: { item: Object, gems: Object, enchant: Object },
    feet: { item: Object, gems: Object, enchant: Object },
    finger1: { item: Object, gems: Object, enchant: Object },
    finger2: { item: Object, gems: Object, enchant: Object },
    trinket1: { item: Object, gems: Object, enchant: Object },
    trinket2: { item: Object, gems: Object, enchant: Object },
    mainhand: { item: Object, gems: Object, enchant: Object },
    offhand: { item: Object, gems: Object, enchant: Object },
    ranged: { item: Object, gems: Object, enchant: Object },
  },
});

const Character = mongoose.model("Character", CharSchema);
module.exports = Character;
