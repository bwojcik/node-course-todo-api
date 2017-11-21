const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
	if (error) {
		return console.log('Unable to connect to mongodb server');
	}

	console.log('Connected to mongodb server');

	//deleteMany
	/*db.collection('Todos').deleteMany({text: 'To delete'}).then((result) => {
		console.log(result);
	});*/
	/*db.collection('Users').deleteMany({name: 'Beata2'}).then((result) => {
		console.log(result);
	});*/


	//deleteOne
	/*db.collection('Todos').deleteMany({text: 'To delete one'}).then((result) => {
		console.log(result);
	});*/

	//findOneAndDelete
	/*db.collection('Todos').findOneAndDelete({text:'To delete'}).then((result) => {
		console.log(result);
	});*/
	db.collection('Users').findOneAndDelete({
		_id: new ObjectID('5a14793bbc7c991d4c742b9c')
	}).then((result) => {
		console.log(result);
	});

	//db.close();
});