import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    user_type: 0,
  });

  const [code, setCode] = useState('');
  const [step, setStep] = useState('register');

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/route');
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8001/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStep('verify');
      } else {
        const error = await res.json();
        alert(error.detail?.[0]?.msg || 'Registration failed');
      }
    } catch (err) {
      alert('Registration error');
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8001/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code }),
      });

      if (res.ok) {
        navigate('/');
      } else {
        const error = await res.json();
        alert(error.detail?.[0]?.msg || 'Verification failed');
      }
    } catch (err) {
      alert('Verification error');
    }
  };

  return (
    <div
      data-theme="forest"
      className="flex items-center justify-center min-h-screen w-full bg-base-200 p-4"
    >
      <div className="w-full max-w-sm bg-base-100 text-base-content shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Register</h1>

        {step === 'register' ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            {/* Username */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-sm">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your username"
                className="input input-bordered w-full input-md rounded-full"
                required
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength={3}
                maxLength={30}
              />
              <label className="label">
                <span className="label-text-alt text-xs">
                  3-30 chars, letters/numbers/dash
                </span>
              </label>
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-sm">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="mail@site.com"
                className="input input-bordered w-full input-md rounded-full"
                required
              />
              <label className="label">
                <span className="label-text-alt text-xs">Enter a valid email</span>
              </label>
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-sm">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full input-md rounded-full"
                required
                minLength={8}
              />
              <label className="label">
                <span className="label-text-alt text-xs">
                  1 number, 1 lowercase, 1 uppercase
                </span>
              </label>
            </div>

            <button className="btn btn-success rounded-full text-white text-md tracking-wide font-semibold mt-2">
              Register
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-5">
            <label className="label">
              <span className="label-text text-sm">Verification Code</span>
            </label>
            <input
              type="text"
              placeholder="Enter code from email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input input-bordered w-full input-md rounded-full"
              required
            />
            <button
              className="btn btn-success rounded-full text-white text-md tracking-wide font-semibold"
              onClick={handleVerify}
            >
              Verify Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
