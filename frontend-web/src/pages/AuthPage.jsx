import { useState, useRef } from "react"
import axios from "axios"
import googleIcon from "../assets/google.png"
import facebookIcon from "../assets/facebook.png"
import promotionBanner from "../assets/banner.png"
import NavigationBar from "../components/NavigationBar"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isDark, setIsDark] = useState(localStorage.getItem("mode"))
  const [showPassword, setShowPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  let email = useRef()
  let username = useRef()
  let password = useRef()
  let confirm_password = useRef()

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("mode", isDark)
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
  }

  function submitLogin() {
    let user = {
      "email": email.value,
      "password": password.value
    }
    axios.post('http://localhost:8081/api/v1/auth/login', user)
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
        console.log(error)
    })
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-300`}>
      {/* Navigation Bar */}
      <NavigationBar isDark={isDark} toggleTheme={toggleTheme} />
      

      {/* Main Auth Container */}
      <div className="flex items-center justify-center transition-all duration-300 py-5">
        <div
          className={`w-full max-w-6xl ${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl overflow-hidden`}
        >
          <div className="grid md:grid-cols-2 min-h-[600px]">
            {/* Form Section - Slides based on auth mode */}
            <div className={`order-1 transition-all duration-500 ${isLogin ? "md:order-1" : "md:order-2"}`}>
              <div className="p-8 md:p-12 h-full flex flex-col justify-center">
                <div className="mb-8">
                  <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>
                    {isLogin ? "Sign in" : "Create account"}
                  </h1>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={toggleAuthMode} className="text-blue-600 hover:underline font-medium">
                      {isLogin ? "Create now" : "Sign in"}
                    </button>
                  </p>
                </div>

                <div className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Full Name
                      </label>
                      <input
                        ref={(e) => (username = e)}
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className={`w-full h-12 px-4 rounded-lg border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      E-mail
                    </label>
                    <input
                      ref={(e) => (email = e)}
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      className={`w-full h-12 px-4 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Password
                    </label>
                    <input
                      ref={(e) => (password = e)}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      className={`w-full h-12 px-4 rounded-lg border ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  
                  {showPassword ? 
                  <svg onClick={() => setShowPassword(!showPassword)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg> : 
                  <svg onClick={() => setShowPassword(!showPassword)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg> 
                  }

                  {!isLogin && (
                    <div className="space-y-2">
                      <label
                        htmlFor="confirm-password"
                        className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Confirm Password
                      </label>
                      <input
                        ref={(e) => (confirm_password = e)}
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••"
                        className={`w-full h-12 px-4 rounded-lg border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  )}
                  
                  {!isLogin? showConfirmPassword ? 
                  <svg onClick={() => setShowConfirmPassword(!showConfirmPassword)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg> : 
                  <svg onClick={() => setShowConfirmPassword(!showConfirmPassword)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg> 
                  :
                  <></>
                  }
                  

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          id="remember"
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="remember"
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} cursor-pointer`}
                        >
                          Remember me
                        </label>
                      </div>
                      <a
                        href="#"
                        className={`text-sm ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"}`}
                      >
                        Forgot Password?
                      </a>
                    </div>
                  )}

                  <button
                    className="w-full h-12 bg-[#1a4d3a] hover:bg-[#153d2e] text-white rounded-lg font-medium transition-colors"
                    onClick={submitLogin}
                  >
                    {isLogin ? "Sign in" : "Create account"}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${isDark ? "border-gray-700" : "border-gray-300"}`}></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className={`px-2 ${isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600"}`}>
                        OR
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      className={`w-full h-12 rounded-lg border ${
                        isDark
                          ? "border-gray-600 hover:bg-gray-700 text-white"
                          : "border-gray-300 hover:bg-gray-50 text-gray-900"
                      } flex items-center justify-center gap-2 transition-colors`}
                    >
                      <img src={googleIcon} alt="Google" className="w-5 h-5" />
                      Continue with Google
                    </button>
                    <button
                      type="button"
                      className={`w-full h-12 rounded-lg border ${
                        isDark
                          ? "border-gray-600 hover:bg-gray-700 text-white"
                          : "border-gray-300 hover:bg-gray-50 text-gray-900"
                      } flex items-center justify-center gap-2 transition-colors`}
                    >
                      <img src={facebookIcon} alt="Facebook" className="w-5 h-5" />
                      Continue with Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Banner Section - Slides based on auth mode */}
            <div className={`hidden md:block transition-all duration-500 ${isLogin ? "md:order-2" : "md:order-1"}`}>
              <div className="relative h-full min-h-[400px] bg-gradient-to-br from-[#1a4d3a] to-[#2d6b4f] p-8 md:p-12 flex flex-col justify-between overflow-hidden">
                {/* Support Badge */}
                <div className="flex justify-end">
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Support
                  </div>
                </div>

                {/* Main Content Card */}
                <div className={`rounded-2xl p-6 shadow-xl transform transition-all duration-500 hover:scale-105 ${isDark ? "bg-gray-800" : "bg-white"}`}>
                  <img
                    src={promotionBanner}
                    alt="Feature showcase"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className={`text-2xl font-bold  mb-2 ${isDark ? "text-amber-50" : "text-gray-900"}`}>
                    {isLogin ? "Reach financial goals faster" : "Start your journey today"}
                  </h2>
                  <p className={`text-sm mb-4 ${isDark ? "text-white" : "text-gray-600"}`}>
                    {isLogin
                      ? "Use your Venus card around the world with no hidden fees. Hold, transfer and spend money."
                      : "Join thousands of users who trust our platform for their financial needs."}
                  </p>
                  <button className="bg-[#1a4d3a] hover:bg-[#153d2e] text-white px-6 py-2 rounded-lg transition-colors">
                    Learn more
                  </button>
                </div>

                {/* Bottom Section */}
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-3">
                    {isLogin ? "Introducing new features" : "Welcome to our platform"}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {isLogin
                      ? "Analyzing previous trends ensures that businesses always make the right decision. And as the scale of the decision and its impact magnifies..."
                      : "Experience seamless authentication and access to powerful features designed to help you succeed."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
