const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
	if (error) {
		return console.log('Unable to connect to mongodb server');
	}

	console.log('Connected to mongodb server');

	//findOneAndUpdate
	/*db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID('5a14780521889013d89b2236')
	}, {
		$set: {
			completed: true
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});*/

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5a1479d00f8d3a2388cb01c3')
	}, {
		$set: {
			name: 'Michal'
		},
		$inc: {
			age: 5
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});

	//db.close();
});