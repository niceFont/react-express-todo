import React from "react";

const styles = {
    completed: {
        textDecoration: "line-through",
        color: "#f44336",
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            temp: "Express Todos",
            todos: [],
            error: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNewList = this.handleNewList.bind(this);
    }

    handleChange (e) {
        this.setState({temp: e.target.value})
    }
    handleNewList () {
        if(this.state.todos.length !== 0) { 
        this.setState({
            todos: []
        })

        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/api", true);
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.setRequestHeader("Custom-API", "af704b6c-32ed-423a-9013-0f090d24bd88")
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                 this.setState({todos: JSON.parse(xhr.responseText)
                })
            }
            else if (xhr.status=== 500){
                
                this.setState({error: xhr.statusText})
            }
        }
        xhr.send(null)
    }
    else {
    this.setState({error: "Error: List is already Empty!"})
}
}
    //UPDATING TODOS CLIENT 
    handleComplete (id) {
        let data = {_id: id};
        let newTodos = this.state.todos.map((todo) => {
            if (todo._id === id) {
                todo.completed = !todo.completed
                data.completed = todo.completed
            }
            return todo
        })

        this.setState({todos: newTodos})

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", "/api", true);
        xhr.setRequestHeader("Custom-API", "af704b6c-32ed-423a-9013-0f090d24bd88")
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                 this.setState({todos: JSON.parse(xhr.responseText)
                })
            }
            else if (xhr.status > 200) {
                this.setState({error: xhr.statusText})
            }
        }
        xhr.send(JSON.stringify(data));


    }

    //SENDING A POST REQUEST TO SERVER WITH THE SUBMITTED TODO
    handleSubmit (e) {
        e.preventDefault()
        if(this.formRef.value === "") this.setState({error: "Error: Empty Todo passed!"})
        else {
            console.log(this.formRef.value)
            this.setState({temp: "Express Todos"})
            let submittedTodo = this.formRef.value.split("")
            submittedTodo = submittedTodo[0].toLocaleUpperCase() + submittedTodo.splice(1, submittedTodo.length).join("")
            let data = {todo: submittedTodo}
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api", true);
            xhr.setRequestHeader("Custom-API", "af704b6c-32ed-423a-9013-0f090d24bd88")
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.onreadystatechange = () => {
                if(xhr.readyState === 4 && xhr.status === 200) {
                    this.setState({error: false, todos: JSON.parse(xhr.responseText)});}
                else {
                    
                    this.setState({error: xhr.statusText})
                }
            }


            xhr.send(JSON.stringify(data));
            this.formRef.value = "";
        }
    }

    //FETCHING THE TODO LIST
    componentDidMount() {

        let headers = new Headers({
            "Custom-API": "af704b6c-32ed-423a-9013-0f090d24bd88"
        })
        let init = {
            method: "GET",
            headers: headers,
            mode: "cors",
            cache: "default"
        }
        
        fetch("/api", init)
            .then((response) => {
                response.json()
                .then(data =>{
                    this.setState({todos: data})
                    })
            })
            .catch((err) => {
                this.setState({error: err})
            })
            
    }


    render() {
        
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12" id="main">
                        <h1>{this.state.temp === "" ? "Express Todos" : this.state.temp}</h1>
                        <span style={{color: "red"}}>{this.state.error}</span>
                        <form >
                            <input autoComplete="off" onChange={this.handleChange} ref={(input) => this.formRef = input} id="text-input" type="text" name="todo" />
                            <input onClick={this.handleSubmit} type="submit" value="Submit" />
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <span><i>created by:</i></span>
                            <span><a alt="github-link" href="https://github.com/niceFont">GitHub</a></span>
                            <span><a alt="twitter-link" href="https://twitter.com/nicestfont">@Twitter</a></span>
                            </div>
                            </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <button onClick={this.handleNewList}>New Todo List</button>
                            </div>
                            </div>
                    <div className="row">
                        <div id="list" className="col-sm-12">
                            <div id="board">
                            <ul>
                                {this.state.todos.map((todo, index) => {
                                    return <li onClick={this.handleComplete.bind(this,todo._id)} style={todo.completed ? styles.completed : null} key={index}>{todo.text}</li>
                                })}
                            </ul>
                            </div>
                            </div>
                    </div>
                </div>
        )
    }
}

module.exports = App;