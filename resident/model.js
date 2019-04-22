const mongoose = require('mongoose');

const ResidentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
  },
  apartment: {
    type: Number,
    required: true,
  },
  block: {
    type: String,
    enum: ['A', 'B', 'C'],
  },
});


const ResidentModel = mongoose.model('Resident', ResidentSchema);

module.exports = ResidentModel;
