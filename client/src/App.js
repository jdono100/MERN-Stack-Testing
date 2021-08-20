import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);

  const register = () => {
    axios({
      method: 'POST',
      data: {
        username: regUsername,
        password: regPassword,
      },
      withCredentials: true,
      url: 'http://localhost:3001/register'
    }).then(res => console.log(res));
  };

  const login = () => {
    axios({
      method: 'POST',
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: 'http://localhost:3001/login'
    }).then(res => console.log(res));
  };

  const getUser = () => {
    axios({
      method: 'GET',
      withCredentials: true,
      url: 'http://localhost:3001/getUser'
    }).then(res => {
      setData(res.data);
      console.log(res.data);
    });
  };

  return (
    <div className="App">
      <div>
        <h1>Register</h1>
        <input placeholder="Username" onChange={e => setRegUsername(e.target.value)}/>
        <input placeholder="Password" onChange={e => setRegPassword(e.target.value)}/>
        <button onClick={register}>Submit</button>
      </div>
      <div>
        <h1>Login</h1>
        <input placeholder="Username" onChange={e => setLoginUsername(e.target.value)}/>
        <input placeholder="Password" onChange={e => setLoginPassword(e.target.value)}/>
        <button onClick={login}>Submit</button>
      </div>
      <div>
        <h1>Get User</h1>
        <button onClick={getUser}>Submit</button>
        {data ? <h6>Welcome back, {data.username}</h6> : null}
      </div>
    </div>
  );
}

export default App;
