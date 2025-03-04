export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                <form className="mt-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex justify-between items-center mt-4">
                        <label className="flex items-center">
                            <input type="checkbox" className="text-blue-500" />
                            <span className="ml-2 text-gray-600 text-sm">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-500 text-sm hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Sign In
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-sm text-center text-gray-600 mt-4">
                    Don&apos;t have an account?{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
