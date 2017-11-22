const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');

var id = '5a154fbebb219b0013933781';

if (!ObjectID.isValid(id)) {
	console.log('Id not valid');
}
/*Todo.find({
	_id: id
}).then((todos) => {
	console.log('todos', todos);
});

Todo.findOne({
	_id: id
}).then((todo) => {
	console.log('todo', todo);
});*/

Todo.findById(id).then((todo) => {
	if (!todo) {
		return console.log('Id not found');
	}
	console.log('todo by id', todo);
}).catch((e) => {
	console.log('Error', e);
});