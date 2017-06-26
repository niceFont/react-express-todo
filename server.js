require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path")
const bodyParser = require("body-parser");
const Port = process.env.PORT || 8000;
const { buildTodo, checkEmptyObject, findTodos, saveTodo, updateTodo } = require("./Promises");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("static"));



app.get("/api", (request, response) => {
    async function sendTodos() {
        try {
            let find = await findTodos()
            return find;
        } catch (err) {
            response.status(500).send(err)
            console.error(err);
        }
    }
    sendTodos()
        .then((data) => response.send(data))



})

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "static/html/index.html"));
});


app.post("/api", (request, response) => {
    async function processTodo(object) {
        try {
            let check = await checkEmptyObject(object)
            let build = await buildTodo(check)
            let save = await saveTodo(build)
            let find = await findTodos()
            return find
        } catch (err) {
            response.status(500).send(err)
            console.error(err);
        }
    }
    processTodo(request.body)
        .then(data => response.send(data))


});

app.put("/api", (request, response) => {
    async function UpdateTodo(obj) {
        try {
            let update = await updateTodo(obj)
            let find = await findTodos()
            return find
        } catch (err) {
            response.status(500).send(err)
            console.error(err);
        }
    }

    UpdateTodo(request.body)
        .then(data => response.status(200).send(data))

})

app.listen(Port, () => {
    console.log(`Serve listening on Port ${Port}`);
});