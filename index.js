const express = require("express");
const {v4: uuidv4} = require("uuid");
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 3003;
const app = express();

app.use(express.json());
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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// GET_all_persons.rest
app.get("/api/persons", (req, res) => {
    res.status(200).json(persons)
});

// GET_person.rest
app.get("/api/persons/:id", (req, res) => {
    const id = +req.params.id;
    
    const person = persons.find((person) => person.id === id);

    if (!person) {
        return res.status(404).json({
            status: "not found"
        })
    }

    res.status(200).json(person)
})

// GET_info.rest
app.get("/api/info", (req, res) => {
    res.status(200).send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>
    `)
});

// POST_person.rest
app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.json({error: "missing data"})
    }

    const existingPerson = persons.find((person) => {
        return person.name === body.name;
    });

    if (existingPerson) {
        return res.json({error: "this person already exists."})
    }

    const person = {
        id: uuidv4(),
        name: body.name,
        number: body.number,
    }

    console.log(person);

    persons = [...persons, person];
    res.status(200).json(person)
})

// DELETE_person.rest
app.delete("/api/persons/:id", (req, res) => {
    const id = +req.params.id;

    persons = persons.filter((person) => person.id !== id);

    res.status(204).end();
})

app.listen(PORT, () => {console.log(`listening on ${PORT}`)})