import './login.css';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-6 rounded-2xl card-login">
                <h2 className="text-2xl font-bold text-center">Login</h2>

                <form className="mt-6">
                    {/* Email Field */}
                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            className="mt-1 w-full px-4 py-2 border rounded-lg"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mt-4">
                        <label className="block font-medium">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full px-4 py-2 border rounded-lg"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center mt-4">
                        <label className="flex items-center">
                            <input type="checkbox" className="text-blue-500" />
                            <span className="ml-2 text-sm">Remember me</span>
                        </label>
                        <a href="#" className="text-primary text-sm hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 py-2 rounded-lg transition bg-primary"
                    >
                        Sign In
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-sm text-center mt-4">
                    Don&apos;t have an account?{' '}
                    <a href="#" className="text-primary hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
