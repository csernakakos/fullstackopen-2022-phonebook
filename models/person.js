const mongoose = require("mongoose");

const URL = process.env.MONGODB_URL;
mongoose
    .connect(URL)
    .then(result => {console.log('connected to PERSONS MongoDB')})
    .catch((error) => {console.log('error connecting to PERSONS MongoDB:', error.message)})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    number: {
        type: String,
        required: [true, "Enter a phone number."],
        minLength: 8,
        validate: {
            validator: function(v) {
              return /\d{2}-(?:\d.*){3,}/.test(v) || /\d{3}-(?:\d.*){3,}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
          }
    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

const Person = new mongoose.model("Person", personSchema);

module.exports = Person;