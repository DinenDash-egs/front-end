import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/route');
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8001/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // ← this should match your backend response key
        navigate('/route');
      } else {
        const error = await res.json();
        alert(error.detail?.[0]?.msg || 'Login failed');
      }
    } catch (err) {
      alert('Login error');
    }
  };

  return (
    <div
      data-theme="forest"
      className="flex items-center justify-center min-h-screen w-screen bg-base-200 p-4"
    >
      <div className="w-full max-w-sm bg-base-100 text-base-content shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="form-control w-full">
            <label className="label"><span className="label-text text-sm">Email</span></label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="mail@site.com"
              className="input input-bordered w-full input-md rounded-full"
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text text-sm">Password</span></label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input input-bordered w-full input-md rounded-full"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success rounded-full text-white text-md tracking-wide font-semibold mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
