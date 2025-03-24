const Login = () => {
    return (
      <div
        data-theme="forest"
        className="flex items-center justify-center min-h-screen w-screen bg-base-200 p-4"
      >
        <div className="w-full max-w-sm bg-base-100 text-base-content shadow-xl rounded-2xl px-6 py-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">Login</h1>
  
          <form className="flex flex-col gap-5">
            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-sm">Email</span>
              </label>
              <input
                type="email"
                placeholder="mail@site.com"
                className="input input-bordered w-full input-md rounded-full"
                required
              />
            </div>
  
            {/* Password */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-sm">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full input-md rounded-full"
                required
              />
            </div>
  
            {/* Login Button */}
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