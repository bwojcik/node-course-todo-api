const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBe(3);
				expect(todos[2].text).toBe(text);
				done();
			}).catch((e) => {
				done(e);
			});
		});
	});

	it('should not create todo with invalid body data', (done) => {
		var text = '';

		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({text})
		.expect(400)
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((e) => {
				done(e);
			});
		});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
		.get('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(1);
		})
		.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		var hexId = todos[0]._id.toHexString();

		request(app)
		.get('/todos/' + hexId)
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);
	});

	it('should not return todo doc created by other user', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
		.get('/todos/' + hexId)
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		request(app)
		.get('/todos/' + new ObjectId().toHexString())
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('should return 404 for non objectId', (done) => {
		request(app)
		.get('/todos/123')
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
		.delete('/todos/' + hexId)
		.set('x-auth', users[1].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id).toBe(hexId);
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.findById(hexId).then((todo) => {
				expect(todo).toBeFalsy();
				done();
			}).catch((e) => {
				done(e);
			});
		})
	});

	it('should not remove a todo created by other user', (done) => {
		var hexId = todos[0]._id.toHexString();

		request(app)
		.delete('/todos/' + hexId)
		.set('x-auth', users[1].tokens[0].token)
		.expect(404)
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			Todo.findById(hexId).then((todo) => {
				expect(todo).toBeTruthy();
				done();
			}).catch((e) => {
				done(e);
			});
		})
	});

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectId().toHexString();
		request(app)
		.delete('/todos/' + hexId)
		.set('x-auth', users[1].tokens[0].token)
		.expect(404)
		.end(done);
	});
	
	it('should return 404 for non objectId', (done) => {
		request(app)
		.delete('/todos/123')
		.set('x-auth', users[1].tokens[0].token)
		.expect(404)
		.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update a todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = "Changed todo text";

		request(app)
		.patch('/todos/' + hexId)
		.set('x-auth', users[0].tokens[0].token)
		.send({
			text: text, 
			completed: true
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(typeof res.body.todo.completedAt).toBe('number');
		})
		.end(done);
	});

	it('should not update a todo created by other user', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = "Changed todo text";

		request(app)
		.patch('/todos/' + hexId)
		.set('x-auth', users[0].tokens[0].token)
		.send({
			text: text, 
			completed: true
		})
		.expect(404)
		.end(done);
	});

	it('should clear completeAt when todo is not completed', (done) => {
		var hexId = todos[0]._id.toHexString();

		request(app)
		.patch('/todos/' + hexId)
		.set('x-auth', users[0].tokens[0].token)
		.send({
			completed: false
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.competeAt).toBeFalsy();
		})
		.end(done);
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
			expect(res.body).toEqual({});
		})
		.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'example@example.com';
		var password = '123qwe';
		
		request(app)
		.post('/users')
		.send({email, password})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toBeTruthy();
			expect(res.body._id).toBeTruthy();
			expect(res.body.email).toBe(email);
		})
		.end((err) => {
			if (err) {
				return done(err);
			}

			User.findOne({email}).then((user) => {
				expect(user).toBeTruthy();
				expect(user.password).not.toBe(password);
				done();
			}).catch((e) => {
				done(e);
			});
		});
	});

	it('should return validation errors if request invalid', (done) => {
		var email = 'example@example';
		var password = '123qwe';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done);
	});

	it('should not create a user if email in use', (done) => {
		var email = users[0].email;
		var password = '123qwe';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done);
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		var email = users[1].email;
		var password = users[1].password;

		request(app)
		.post('/users/login')
		.send({email, password})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toBeTruthy();
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}

			User.findById(users[1]._id).then((user) => {
				expect(user.toObject().tokens[1]).toMatchObject({
					access: 'auth',
					token: res.headers['x-auth']
				});
				done();
			}).catch((e) => {
				done(e);
			});
		});
	});

	it('should reject invalid login', (done) => {
		var email = users[1].email;
		var password = users[1].password + '1';

		request(app)
		.post('/users/login')
		.send({email, password})
		.expect(400)
		.expect((res) => {
			expect(res.headers['x-auth']).toBeFalsy();
		})
		.end((err) => {
			if (err) {
				return done(err);
			}

			User.findById(users[1]._id).then((user) => {
				expect(user.tokens.length).toBe(1);
				done();
			}).catch((e) => {
				done(e);
			});
		});
	});
});

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', (done) => {
		request(app)
		.delete('/users/me/token')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.end((err) => {
			if (err) {
				return done(err);
			}

			User.findById(users[0]._id).then((user) => {
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((e) => {
				done(e);
			});
		});
	});
});