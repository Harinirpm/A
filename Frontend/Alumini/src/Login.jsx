// Login.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

import './Login.css';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:8081/log')
            .then(res => {
                if (res.data.valid) {
                    setUser({ email: res.data.email, role: res.data.role });
                    navigate('/');
                } else {
                    navigate('/login');
                }
            })
            .catch(err => console.log(err));
    }, [navigate, setUser]);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/log/login', values)
            .then(res => {
                if (res.data.Status === "Success") {
                    setUser({ email: res.data.email, role: res.data.role });
                    navigate('/');
                } else {
                    alert(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="login">
            <div className="login-container">
                <div className="login-form">
                    <div className="login-header">
                        <h1>Alumini Tracking Sytem</h1>
                        <h2>Hi, Welcome back</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <input type="email" placeholder="Email" name='email'
                                onChange={e => setValues({ ...values, email: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <input type="password" placeholder="Password" name='password'
                                onChange={e => setValues({ ...values, password: e.target.value })} />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                        {/* <button type="button" className="google-signin">
                            <img src={img} alt="Google Logo" />
                            Sign in with Google
                        </button> */}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
