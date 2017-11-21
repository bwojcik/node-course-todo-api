const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
	if (error) {
		return console.log('Unable to connect to mongodb server');
	}

	console.log('Connected to mongodb server');

	/*db.collection('Todos').find({
		_id: new ObjectID("5a147b90722cc71bc2aaca6a")
		}).toArray().then((docs) => {
		console.log('Todos');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (error) => {
		console.log('Unable to fetch todos', error);
	});*/

	/*db.collection('Todos').find().count().then((count) => {
		console.log('Todos');
		console.log('Count: ', count);
	}, (error) => {
		console.log('Unable to count todos', error);
	});*/

	db.collection('Users').find({
		name: 'Beata'
		}).toArray().then((docs) => {
		console.log('Users');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (error) => {
		console.log('Unable to fetch users');
	});

	//db.close();
});