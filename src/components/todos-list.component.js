import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';





const Todo = (props) => {

            let fullpaginate;
            
           
    
    return (<tr>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
            <br />
           <button onClick={ () =>
                    axios.delete('http://18.188.88.61/api/'+props.todo._id+props.fullpaginate)
                        .then((res) => props.deleteItem(props.todo._id, res))                    
                        .catch(err => console.log(err))
                }
    >Delete</button>
            
            
        </td>
    </tr>);
}

class TodosList extends Component {
    
    constructor(props) {
        super(props);
       
        this.deleteItemHandler = this.deleteItemHandler.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);
        this.state = {todos: [], totalrow:'',active:1,perpage:5};
    }
    
    componentDidMount = () => {
        let pagination="/1/"+this.state.perpage;
        let fullpaginate='pagination'+pagination;
        let activepg = 1;
        let perpage = this.state.perpage;
        let calnum = 0;
        let addone = 0;
        if(this.props.match.params.limitid && this.props.match.params.offetid)
        {
            let offid = parseInt(this.props.match.params.offetid);
            if(offid > 1)
            {
                offid = Number(offid - 1) * perpage;
            }
            pagination =  "/"+offid+'/'+parseInt(this.props.match.params.limitid);
            fullpaginate = 'pagination'+pagination;
            activepg = parseInt(this.props.match.params.offetid);
            perpage = this.state.perpage;
        }
        
        axios.get('http://18.188.88.61/api/'+fullpaginate)
            .then(response => {
                //console.log(response);
                
                calnum = Math.ceil(parseInt(response.data.totalobj.totnum)%perpage);
               
                if(calnum != 0){
                    addone = 1;  
                }
                
                
                
                this.setState({ todos: response.data.todos, 
                     active: activepg,
                     totalrow:parseInt(response.data.totalobj.totnum/perpage)+addone
                        });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    deleteItemHandler = (id, res) => {
        
        const updatedTodos = this.state.todos.filter(todo => todo._id !== id);
        let addone = 0;
       let calnum = Math.ceil(parseInt(res.data.totalobj.totnum)%this.state.perpage);
        if(calnum != 0){
            addone = 1;  
                    }
        
        this.setState({ 
            todos: res.data.todos, 
            totalrow:res.data.totalrow,
            active: res.data.activpg,    
               });
        let curpage = 'pagination/'+res.data.activpg+'/'+this.state.perpage;
        if(res.data.totalobj){
        this.props.history.push('/'+curpage);       
            }
        //return this.setState({todos: res.data.todos})
       }
       onChangePage = (curnm) =>{
        
        let perpage = this.state.perpage;
        let fullpaginate = '';
        let offnm = 1;
        let calnum = 0;
        let addone = 0;
        if(curnm>1)
        {  
            offnm = Number(curnm - 1) * perpage;
        }
        
        fullpaginate = 'pagination/'+offnm+'/'+perpage;
        let curpage = 'pagination/'+curnm+'/'+perpage;
       
        
       
        axios.get('http://18.188.88.61/api/'+fullpaginate)
        .then(response => {
            calnum = Math.ceil(parseInt(response.data.totalobj.totnum)%perpage);
                if(calnum != 0){
                    addone = 1;  
                }
            this.setState({ todos: response.data.todos, 
                 active: curnm,
                 
                 totalrow:parseInt(response.data.totalobj.totnum/perpage)+addone
                    });
                    this.props.history.push('/'+curpage);       
        })
        .catch(function (error){
            console.log(error);
        })
        
    }   
    
    
    render() {
   
    let active = this.state.active;
   
    let items = [];
    for (let number = 1; number <= this.state.totalrow; number++) {
      items.push(
        <Pagination.Item key={number} onClick={()=>this.onChangePage(number)} active={number === active}>
          {number}
        </Pagination.Item>,
      );
    }
    let fullpaginate  = '/1/'+this.state.perpage;
    let pagination;
    let calNum = 0
    if(this.props.match.params.limitid && this.props.match.params.offetid)
        {
            calNum = this.props.match.params.offetid;    
            if(calNum>1)
            {  
                calNum = Number(calNum - 1) * this.state.perpage;
            }

            pagination =  "/"+parseInt(calNum)+'/'+parseInt(this.props.match.params.limitid)+'/'+this.state.active;
            fullpaginate = pagination;
        }   
            //console.log('DDCC'+fullpaginate);
    
        return (
            <div>
            <h3>Todos List</h3>
            <table className="table table-striped" style={{ marginTop: 20 }} >
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Responsible</th>
                        <th>Priority</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                    
                this.state.todos.map((currentTodo, i) => 
                    {
                        return(<Todo todo={currentTodo} fullpaginate={fullpaginate} perpage={this.state.perpage} key={i} deleteItem={this.deleteItemHandler} />) 
                    
                    }) 
                }
                 
                    
                </tbody>
            </table> 
            <Pagination >{items}</Pagination>
            <br />
            <br />
            <br />

        </div>
        )
    }
}

export default TodosList;
