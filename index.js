const express = require("express");
const dotenv = require("dotenv").config({path: "./.env"});
const {v4: uuidv4} = require("uuid");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const PORT = process.env.PORT || 3003;

const app = express();

app.use(express.json());
app.use(express.static('build'))
app.use(cors());

app.use(morgan(function (tokens, req, res) {

   morgan.token('reqBody', (req, res) => {
       let reqBody = "";
       if (tokens.method(req) === "POST") {
           return reqBody = JSON.stringify(req.body);
       }
       return reqBody;
    })

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.reqBody(req, res),
    ].join(' ')
  }));

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// GET_all_persons.rest

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'wrongly formatted id' })
    }

    if (error.name === "ValidationError") {
        return response.status(400).json({error: error.message});
    }
  
    next(error)
}

app.get("/api/persons", async (req, res, next) => {
    try {
        const persons = await Person.find();
        res.status(200).json(persons)
    } catch (error) {
        next(error);
    }
});

// GET_person.rest
app.get("/api/persons/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const person = await Person.findById(id);

        if (!person) {
            return res.status(404).json({
                status: "not found"
            })
        }
    
        res.status(200).json(person)
    } catch (error) {
        next(error);
    }
})

// GET_info.rest
app.get("/api/info", async (req, res, next) => {
    try {
        const num = await Person.countDocuments();

        res.status(200).send(`
        <p>Phonebook has info for ${num} people.</p>
        <p>${new Date()}</p>
        `)
    } catch (error) {
        next(error);
    }
});

// POST_person.rest
app.post("/api/persons", async (req, res, next) => {
    // if (!body.name || !body.number) {
    //     return res.json({error: "missing data"})
    // }

    // const existingPerson = persons.find((person) => {
    //     return person.name === body.name;
    // });

    // if (existingPerson) {
    //     return res.json({error: "this person already exists."})
    // }

    // const person = {
    //     id: uuidv4(),
    //     name: body.name,
    //     number: body.number,
    // }
    // persons = [...persons, person];

    const {name, number} = req.body;
    try {
        const person = new Person({
            name,
            number,
        });

        let savedPerson = await person.save();
        console.log(savedPerson);
        res.status(200).json(savedPerson)

    } catch (error) {
       next(error);
    }

})

app.put("/api/persons/:id", async (req, res, next) => {
    console.log("PUT TO EXISTING");
    try {
        const {id} = req.params;
        const {name, number} = req.body;
        const personDB = await Person.findByIdAndUpdate(id, {number}, {new: true, runValidators: true, context: "query"});

        console.log(name, number, "<<<")
        console.log(personDB.name, personDB.number, "<<<<");

        res.json(personDB);


    } catch (error) {
        next(error);
    }
})

// DELETE_person.rest
app.delete("/api/persons/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        await Person.findByIdAndDelete(id);
        res.status(204).end();

    } catch (error) {
        next(error);
    }
})

app.use(errorHandler);

app.listen(PORT, () => {console.log(`listening on ${PORT}`)})