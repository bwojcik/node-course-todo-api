const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
	if (error) {
		return console.log('Unable to connect to mongodb server');
	}

	console.log('Connected to mongodb server');

	/*db.collection('Todos').insertOne({
		text: 'Something to do',
		completed: false
	}, (error, result) => {
		if (error) {
			return console.log('Unable to insrt todo', error);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	});*/

	/*db.collection('Users').insertOne({
		name: 'Beata',
		age: 35, 
		location: 'Lodz'
	}, (error, result) => {
		if (error) {
			return console.log('Unable to insert user', error);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
		console.log(result.ops[0]._id.getTimestamp());
	});*/

	db.close();
});