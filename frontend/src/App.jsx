import { useState, useEffect } from "react";
import http from "axios";
import './App.css';

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authUsername, setAuthUserName] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [todo, setTodo] = useState('')
  const [page, setPage] = useState('reg')

  const login = async () => {
    try{
      const response = await http.post('http://localhost:4000/api/login', {}, {
        headers: {
          'Authorization': `${authUsername}&&&${authPassword}`
        }
      });
      localStorage.setItem('sessionID', response.data)
      setPage('todo')
    }
    catch(error){
      alert('wrong username/password')
    }
  }
  const createToDo = async () => {
    try {
      const response = await http.post('http://localhost:4000/api/todo', { msg: todo }, {
        headers: {
          'Authorization': localStorage.getItem('sessionID')
        }
      });
      setTodo('')
      alert('todo created');
    }
    catch (error) {
      if(error.response.status === 401){
        alert('Your session has expired')
        setPage('login')
        localStorage.removeItem('sessionID')
      }
    }
  }

  const signup = async () => {
    try {
      const response = await http.post('http://localhost:4000/api/signup', {
        username,
        password
      });
      alert('yay')
      setUsername('')
      setPassword('')
      setPage('login')

    } catch (error) {
      if (error.response.status === 400) {
        alert('missing credentials')
      } else if (error.response.status === 409) {
        alert('username taken')
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem('sessionID')) {
      setPage('todo')
      
    }
  }, [])
  

  return (
    <div className="App">
      {page === 'reg' &&
        <div className="box">
          <h1>Registration</h1>
          <label for='username'>Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} id='username' />
          <label for='password'>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} id='password' />

          <button onClick={() => signup()}>Sign up!</button>
          <button onClick={()=> setPage('login')}>I already have an account!</button>
        </div>
      }
      {page === 'todo' &&
        <div className="box">
          <h1>To-do's</h1>
          <input type="text" value={todo} onChange={(e) => setTodo(e.target.value)} placeholder="Todo" />
          <button onClick={(e) => createToDo()} disabled={!todo}>Create todo</button>
          <button onClick={(e) => { setPage("login"); setAuthUserName(''); setAuthPassword(''); localStorage.clear() }}>Log out</button>
        </div>
      }
      {page === 'login' &&
        <div className="box">
          <h1>Login</h1>
          <label for='username'>Username</label>
          <input type="text" value={authUsername} onChange={e => setAuthUserName(e.target.value)} id='username' />
          <label for='password'>Password</label>
          <input type="password" name={authPassword} onChange={e => setAuthPassword(e.target.value)} id='password' />
          <button onClick={()=> login()}>Login</button>
          <button onClick={()=> setPage('reg')}>Back to registration!</button>
          
        </div>
      }
    </div>
  );
}

export default App;
