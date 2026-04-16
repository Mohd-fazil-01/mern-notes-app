import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginContext } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      loginContext(res.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Developer Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
        <p className="switch-text">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;