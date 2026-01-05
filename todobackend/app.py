from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Todo

app = Flask(__name__)
CORS(app)  # Allow React frontend to connect

# SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

# Routes
@app.route('/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.all()
    return jsonify([{"id": t.id, "task": t.task, "completed": t.completed} for t in todos])

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.json
    new_todo = Todo(task=data['task'])
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"id": new_todo.id, "task": new_todo.task, "completed": new_todo.completed})

@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    todo = Todo.query.get_or_404(id)
    data = request.json
    todo.completed = data.get('completed', todo.completed)
    todo.task = data.get('task', todo.task)
    db.session.commit()
    return jsonify({"id": todo.id, "task": todo.task, "completed": todo.completed})

@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Deleted"})

if __name__ == "__main__":
    app.run(debug=True)
