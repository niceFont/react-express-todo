import React from "react";


const styles = {
    completed: {
        textDecoration: "line-through",
        opacity: .6,
        color: "red",
        fontWeight: "bold"
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
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (e) {
        this.setState({temp: e.target.value})
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
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                 this.setState({todos: JSON.parse(xhr.responseText)
                })
            }
            else if (xhr.status=== 500){
                this.setState({error: "Database Error"})
            }
        }
        xhr.send(JSON.stringify(data));


    }

    //SENDING A POST REQUEST TO SERVER WITH THE SUBMITTED TODO
    handleSubmit (e) {
        e.preventDefault()
        this.setState({temp: "Express Todos"})
        let data = {todo: this.formRef.value};

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api", true);
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                this.setState({error: false, todos: JSON.parse(xhr.responseText)});}
            else {
                this.setState({error: "Todo Rejected: Empty Todo passed"})
            }
        }


        xhr.send(JSON.stringify(data));
        this.formRef.value = "";
    }

    //FETCHING THE TODO LIST
    componentDidMount() {
        fetch("/api")
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
                        <h1>{this.state.temp}</h1>
                        <span style={{color: "red"}}>{this.state.error}</span>
                        <form >
                            <input onChange={this.handleChange} ref={(input) => this.formRef = input} id="text-input" type="text" name="todo" />
                            <input onClick={this.handleSubmit} type="submit" value="Submit" />
                            </form>
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