const mongoose = require("mongoose");
const Todo = require("./database/database");


module.exports = {
    clearAllTodos: () => {
        return new Promise((resolve, reject) => {
            mongoose.connection.db.dropCollection('todos')
                .then(result => resolve(result))
                .catch(err => reject(err))
        })
    },
    updateTodo: (obj) => {
        return new Promise((resolve, reject) => {
            Todo.findOneAndUpdate({ _id: obj._id }, { completed: obj.completed })
                .then((result) => resolve(result))
                .catch((err) => reject(err))
        })
    },

    checkEmptyObject: (obj) => {
        return new Promise((resolve, reject) => {
            if (typeof obj !== "object" || Array.isArray(obj)) {
                return reject(new Error(`${typeof obj === "object" ? "Array": typeof obj} given instead of Object`))
            }
            if (Object.keys(obj).length === 0) return reject(new Error("EMPTY OBJECT GIVEN"))
            for (let key in Object.keys(obj)) {
                if (obj[Object.keys(obj)[key]] === "") return reject(new Error("EMPTY OBJECT GIVEN"))
            }
            return resolve(obj)
        })
    },


    buildTodo: (body) => {
        return new Promise((resolve, reject) => {
            if (body) {
                let newTodo = new Todo({
                    text: body.todo,
                    completed: false,
                    created_at: new Date(Date.now().toLocaleString)
                })
                resolve(newTodo)
            } else {
                reject(new Error("Not found"))
            }
        })
    },


    saveTodo: (todo) => {
        return new Promise((resolve, reject) => {
            todo.save()
                .then((result) => {
                    resolve(result)
                })
                .catch((err) => {
                    reject(err)
                })
        })

    },


    findTodos: () => {
        return new Promise((resolve, reject) => {
            Todo.find({}).exec()
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    }


}