import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/route');
  }, [navigate]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8001/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail?.[0]?.msg || 'Login failed');
      }

      const data = await res.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username); // backend must return this

      navigate('/stores');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      data-theme="forest"
      className="flex items-center justify-center min-h-screen w-screen bg-base-200 p-4"
    >
      <div className="w-full max-w-sm bg-base-100 shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="mail@site.com"
              className="input input-bordered rounded-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Password</span></label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input input-bordered rounded-full"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary text-white font-semibold rounded-full mt-2"
          >
            Login
          </button>
        </form>

        {/* Register Button */}
        <div className="text-center pt-2">
          <p className="text-sm">Don't have an account?</p>
          <button
            onClick={() => navigate('/register')}
            className="btn btn-outline btn-sm mt-2 rounded-full"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
