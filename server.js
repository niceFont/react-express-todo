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

function checkAuthorized(request, response, next) {
    let apiKey = request.get("Custom-API");
    if (apiKey !== undefined && apiKey === process.env.APIKEY) {
        return next();
    } else {
        return response.status(401).send("Unauthorized Access")
    }
}


app.get("/api", checkAuthorized, async(request, response, next) => {
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


app.post("/api", checkAuthorized, async(request, response, next) => {
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

app.put("/api", checkAuthorized, async(request, response, next) => {
    try {
        let update = await updateTodo(request.body)
        let find = await findTodos()
        return response.status(200).send(find)
    } catch (err) {
        next(err);
    }

})

app.delete("/api", checkAuthorized, async(request, response, next) => {
    try {
        let clearing = await clearAllTodos();
        return response.status(200).send("Success")
    } catch (err) {
        next(err);
    }
})

app.use((err, request, response, next) => {

    console.error(err)
    return response.status(500).send(err)
})

app.get("*", (request, response) => {
    response.status(404).send("Not Found")
})

app.listen(Port, () => {
    console.log(`Serve listening on Port ${Port}`);
});