const ResidentModel = require('./model');

exports.create = async ({
  name, email, cpf, apartment, block,
}) => {
  const resident = new ResidentModel({
    name, email, cpf, apartment, block,
  });

  await resident.save();

  return resident.toObject();
};

exports.update = ({
  id, name, email, cpf, apartment, block,
}) => {
  const $set = {};

  if (name) $set.name = name;
  if (email) $set.email = email;
  if (cpf) $set.cpf = cpf;
  if (apartment) $set.apartment = apartment;
  if (block) $set.block = block;

  if (Object.keys($set).length) return ResidentModel.findByIdAndUpdate(id, { $set }, { new: true });

  return ResidentModel.findById(id);
};

exports.list = ({
  name, email, cpf, apartment, block, page, limit = 30,
}) => {
  const query = {};

  const regex = val => ({ $regex: val, $options: 'i' });

  if (name) query.name = regex(name);
  if (email) query.email = regex(email);
  if (cpf) query.cpf = regex(cpf);
  if (apartment) query.apartment = apartment;
  if (block) query.block = block;

  let command = ResidentModel.find(query).lean();

  if (page) {
    command = command.limit(limit).skip((page - 1) * limit);
  }

  return command.exec();
};

exports.remove = ({ id }) => ResidentModel.findByIdAndDelete(id);
