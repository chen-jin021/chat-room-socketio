const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
});
//register the model
mongoose.model("Message", MessageSchema);

//create connection
mongoose.connect(
  "mongodb+srv://cj1231:shanghai@companycluster.i9rsx.mongodb.net/class11-11?retryWrites=true&w=majority"
);
