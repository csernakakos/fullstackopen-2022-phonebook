const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const URL = process.env.MONGODB_URL;

mongoose.connect(URL);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);


// If only the password is provided:
if (process.argv.length === 3) {
    console.log("phonebook:");

    Person
    .find()
    .then(persons => {
    
        persons.forEach(person => {
            console.log(person);
        });
    
        console.log("________");
        mongoose.connection.close();
        process.exit(1);
    })

}


if (process.argv.length === 4) {
    console.log("The valid syntax is: \n node mongo <password> <name> <number>");
    process.exit(1);
}

if (process.argv.length === 5) {
    const person = new Person({
        name: name,
        number: number,
    });
    
    person
        .save()
        .then(result => {
            console.log(`Added ${name} number ${number} to phonebook.`);
            mongoose.connection.close();
    });
}
