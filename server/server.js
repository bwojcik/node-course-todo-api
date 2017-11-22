var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());
app.post('/todos', (request, response) => {
	var todo = new Todo({
		text: request.body.text,
		completed: request.body.completed
	});

	todo.save().then((doc) => {
		response.send(doc);
	}, (err) => {
		response.status(400).send(err);
	});
});

app.get('/todos', (request, response) => {
	Todo.find().then((todos) => {
		response.send({
			todos
		});
	}, (err) => {
		response.status(400).send(e);
	});
});

app.get('/todos/:id', (request, response) => {
	var id = request.params.id;

	if (!ObjectId.isValid(id)) {
		response.status(400).send();
	}

	Todo.findById(id).then((todo) => {
		if (!todo) {
			response.status(400).send();
		}
		response.send({todo});
	}).catch((e) => {
		response.status(400).send();
	});
});

app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports = {
	app: app
};