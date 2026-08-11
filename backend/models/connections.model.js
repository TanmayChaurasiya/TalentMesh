const User = require("./user.model");
const mongoose = require("mongoose");

const ConnectionRequestSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status_accepted: {
    type: Boolean,
    default: null,
  },
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema,
);

module.exports = ConnectionRequest;
