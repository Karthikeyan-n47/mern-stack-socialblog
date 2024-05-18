const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Contact form should have name!"],
    },
    email: {
      type: String,
      required: [true, "Contact form should have email"],
    },
    message: {
      type: String,
      required: [true, "Contact form should contain a message"],
      maxLength: [250, "Message should not exceed 250 characters"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", ContactSchema);
