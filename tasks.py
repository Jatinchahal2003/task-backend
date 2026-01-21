from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Task

tasks_bp = Blueprint("tasks", __name__)

# Create a task
@tasks_bp.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get("title")
    if not title:
        return {"message": "Task title required"}, 400

    task = Task(title=title, user_id=user_id)
    db.session.add(task)
    db.session.commit()

    return {"message": "Task created"}, 201


# Get all tasks
@tasks_bp.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()

    result = []
    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "completed": task.completed
        })

    return result, 200


# Update task
@tasks_bp.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return {"message": "Task not found"}, 404

    data = request.get_json()
    task.title = data.get("title", task.title)
    task.completed = data.get("completed", task.completed)

    db.session.commit()
    return {"message": "Task updated"}, 200


# Delete task
@tasks_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return {"message": "Task not found"}, 404

    db.session.delete(task)
    db.session.commit()
    return {"message": "Task deleted"}, 200
