import { useState, useRef } from "react"
import axios from "axios"
import googleIcon from "../assets/google.png"
import facebookIcon from "../assets/facebook.png"
import promotionBanner from "../assets/banner.png"
import NavigationBar from "../components/NavigationBar"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isDark, setIsDark] = useState(localStorage.getItem("mode"))
  const [showPassword, setShowPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const [emailInUse, setEmailInUse] = useState(false)
  const [wrongInfo, setWrongInfo] = useState(false)
  const [blankPassword, setBlankPassword] = useState(false)
  const [blankEmail, setBlankEmail] = useState(false)
  const [emailFormat, setEmailFormat] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState(false)
  const [passwordLength, setPasswordLength] = useState(false)
  const [passwordFormat, setPasswordFormat] = useState(false)

  const nav = useNavigate()

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
    email.value = ""
    username.value = ""
    password.value = ""
    confirm_password.value = ""
    setEmailInUse(false)
    setWrongInfo(false)
    setBlankPassword(false)
    setBlankEmail(false)
    setEmailFormat(false)
    setConfirmPassword(false)
    setPasswordLength(false)
    setPasswordFormat(false)
  }

  async function submitLogin() {
    let user = {
      email: email.value,
      password: password.value
    };

    await axios.post('http://localhost:8080/api/v1/auth/login', user)
    .then(function (res) {
      setBlankPassword(false);
      setBlankEmail(false);
      setEmailFormat(false);
      setWrongInfo(false);

      // Store tokens in localStorage (consistent with axiosConfig.js)
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("tokenType", res.data.tokenType);
      
      // Store user info and roles
      localStorage.setItem("roles", JSON.stringify(res.data.roles));
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate based on role
      const roles = res.data.roles || [];
      if (roles.includes('ADMIN')) {
        nav('/admin');
      } else if (roles.includes('DOCTOR')) {
        nav('/doctor');
      } else {
        nav('/'); // Default for PATIENT or other roles
      }
    })
    .catch(function (err) {
      if (!err.response) {
        console.error("Network error or server not reachable");
        return;
      }

      const data = err.response.data;
      
      if (data.email === "must not be blank") {
        setBlankEmail(true);
        setBlankPassword(false);
        setEmailFormat(false);
        setWrongInfo(false);
        return false;
      } 
      if (data.password === "must not be blank") {
        setBlankPassword(true);
        setBlankEmail(false);
        setEmailFormat(false);
        setWrongInfo(false);
        return false;
      } 
      if (data.email === "must be a well-formed email address") {
        setEmailFormat(true);
        setBlankPassword(false);
        setBlankEmail(false);
        setWrongInfo(false);
        return false;
      } 
      if (data.error === "unauthorized") {
        setWrongInfo(true);
        setBlankPassword(false);
        setBlankEmail(false);
        setEmailFormat(false);
        return false;
      } 
    });
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
                    {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
                  </h1>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                    <button onClick={toggleAuthMode} className="text-blue-600 hover:underline font-medium">
                      {isLogin ? "Tạo tài khoản ngay" : "Đăng nhập"}
                    </button>
                  </p>
                </div>

                <div className="space-y-4">

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
                  <Eye onClick={() => setShowPassword(!showPassword)} size={20} className={`${isDark ? "text-white" : "text-black"}`} /> : 
                  <EyeOff onClick={() => setShowPassword(!showPassword)} size={20} className={`${isDark ? "text-white" : "text-black"}`} />
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
                  <Eye onClick={() => setShowPassword(!showPassword)} size={20} className={`${isDark ? "text-white" : "text-black"}`} /> : 
                  <EyeOff onClick={() => setShowPassword(!showPassword)} size={20} className={`${isDark ? "text-white" : "text-black"}`} />
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
                          onClick={() => {setRemember(!remember)}}
                        />
                        <label
                          htmlFor="remember"
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} cursor-pointer`}
                        >
                          Ghi nhớ tôi
                        </label>
                      </div>
                      <a
                        href="#"
                        className={`text-sm ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"}`}
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
                  )}

                  <button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    onClick={submitLogin}
                  >
                    {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
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
                      Đăng nhập bằng Google
                    </button>
                    <button
                      disabled
                      type="button"
                      className={`w-full cursor-not-allowed h-12 rounded-lg border ${
                        isDark
                          ? "border-gray-600 hover:bg-gray-700 text-white"
                          : "border-gray-300 hover:bg-gray-50 text-gray-900"
                      } flex items-center justify-center gap-2 transition-colors`}
                    >
                      <img src={facebookIcon} alt="Facebook" className="w-5 h-5" />
                      Đăng nhập bằng Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Banner Section - Slides based on auth mode */}
            <div className={`hidden md:block transition-all duration-500 ${isLogin ? "md:order-2" : "md:order-1"}`}>
              <div className="relative h-full min-h-[400px] bg-gradient-to-br from-blue-600 to-violet-600 p-8 md:p-12 flex flex-col justify-between overflow-hidden">
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
                    Hỗ trợ
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
                      ? "Tạo nên một nguồn thông tin sức khoẻ đáng tin cậy, dễ đọc, dễ hiểu cho mọi đối tượng độc giả"
                      : "Hội đồng tham vấn y khoa cùng đội ngũ biên tập viên là các bác sĩ, dược sĩ đảm bảo nội dung chúng tôi cung cấp chính xác về mặt y khoa và cập nhật những thông tin mới nhất. "}
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Tìm hiểu thêm
                  </button>
                </div>

                {/* Bottom Section */}
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-3">
                    {isLogin ? "Nền tảng đánh tin cậy" : "Chào mừng đến booking clinic"}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {isLogin
                      ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, eum, doloremque quasi, eveniet excepturi magni"
                      : "quo dolorem minus in distinctio rerum! Nemo molestias laudantium nihil porro fuga, quidem rem laborum."}
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
