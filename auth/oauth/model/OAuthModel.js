const mongoose = require('mongoose');

const OAuthTokenSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['refresh_token', 'access_token'],
    },
    token: { type: String, index: true },
    expiresAt: Date,
    userId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true },
);

OAuthTokenSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const OAuthTokenModel = mongoose.model('OAuthToken', OAuthTokenSchema);

module.exports = OAuthTokenModel;
