const Register = () => {
  return (
    <div
      data-theme="forest"
      className="flex items-center justify-center min-h-screen w-full bg-base-200 p-4"
    >
      <div className="w-full max-w-sm bg-base-100 text-base-content shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Register</h1>

        <form className="flex flex-col gap-5">
          {/* Username */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-sm">Username</span>
            </label>
            <input
              type="text"
              placeholder="Your username"
              className="input input-bordered w-full input-md rounded-full"
              required
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength={3}
              maxLength={30}
              title="Only letters, numbers or dash. Must start with a letter."
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
              placeholder="••••••••"
              className="input input-bordered w-full input-md rounded-full"
              required
              minLength={8}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be 8+ chars, including number, lowercase, uppercase"
            />
            <label className="label">
              <span className="label-text-alt text-xs">
                1 number, 1 lowercase, 1 uppercase
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button className="btn btn-success rounded-full text-white text-md tracking-wide font-semibold mt-2">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
