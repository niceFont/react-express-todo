require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path")
const bodyParser = require("body-parser");
const Port = process.env.PORT || 8000;
const { clearAllTodos, buildTodo, checkEmptyObject, findTodos, saveTodo, updateTodo } = require("./Promises");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("static"));




app.get("/api", async(request, response, next) => {
    try {
        let find = await findTodos()
        return response.status(200).send(find)
    } catch (err) {
        next(err);
    }
})

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "static/html/index.html"));
});


app.post("/api", async(request, response, next) => {
    try {
        let check = await checkEmptyObject(request.body)
        let build = await buildTodo(check)
        let save = await saveTodo(build)
        let find = await findTodos()
        return response.status(200).send(find)
    } catch (err) {
        next(err)
    }
});

app.put("/api", async(request, response, next) => {
    try {
        let update = await updateTodo(request.body)
        let find = await findTodos()
        return response.status(200).send(find)
    } catch (err) {
        next(err);
    }

})

app.delete("/api", async(request, response, next) => {
    try {
        let clearing = await clearAllTodos();
        return response.status(200).send("Success")
    } catch (err) {
        next(err);
    }
})

app.use((err, request, response, next) => {

    console.error(err)
    return response.status(500).send("Error: Something broke!")
})

app.get("*", (request, response) => {
    response.status(404).send("Not Found")
})

app.listen(Port, () => {
    console.log(`Serve listening on Port ${Port}`);
});