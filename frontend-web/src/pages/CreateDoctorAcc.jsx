import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Info, GraduationCap, CalendarCheck, PartyPopper, CircleCheck } from "lucide-react"
import DoctorInformation from "../components/DoctorInformation"
import PatientScheduler from "../components/PatientScheduler"
import DegreeInformation from "../components/DegreeInformaion"
import SimpleNavigation from "../components/SimpleNavigation"

const steps = [
  "Thông tin của bạn",
  "Nhận khách hàng",
  "Minh chứng bằng cấp",
  "Hoàn tất",
]

export default function CreateDoctorAcc() {

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const [form, setForm] = useState({
    doctorName: "",
    address: "",
    email: "",
    phone: "",
    options: [
      { key: "autoAccept", label: "Tự động nhận khách" },
      { key: "deposit", label: "Chuyển khoản cọc" },
      { key: "fullOnly", label: "Chuyển khoản full" },
      { key: "payOnSite", label: "Thanh toán tại nơi" },
    ],
    files: [],
  })
  const [isDark, setIsDark] = useState(localStorage.getItem("mode"))

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("mode", isDark)
  }

  const showInfo = () => {
    console.log(form)
  }

  const handleFilesSelect = (newFiles) => {
    setForm((prev) => ({
      ...prev,
      files: [...([]), ...newFiles],
    }));
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  
  const next = () => {
    setDirection(1)
    setStep((prev) => (prev + 1) % steps.length)
  }

  const back = () => {
    setDirection(-1)
    setStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  const getIcon = (label) => {
    if (label === "Thông tin của bạn") return <Info size={24} />
    else if (label === "Minh chứng bằng cấp") return <GraduationCap size={24} />
    else if (label === "Nhận khách hàng") return <CalendarCheck size={24} />
    else return <PartyPopper size={24} />
  }

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 800 : -800
    }),
    center: {
      x: 0
    },
    exit: (dir) => ({
      x: dir > 0 ? -800 : 800
    }),
  }

  return (
    <div className={`${isDark ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"}  transition-colors duration-`}>
      <div className="max-w-3xl mx-auto mt-10 flex flex-col h-screen">
        <SimpleNavigation isDark={isDark} toggleTheme={toggleTheme} />
        {/* Step Header */}
        <div className="flex justify-between items-center w-full my-10 relative">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-3 left-1/2 w-full h-[2px] ${
                    i < step ? "bg-orange-500" : "bg-gray-400"
                  }`}
                ></div>
              )}

              {/* Step Circle */}
              <div
                className={`w-6 h-6 flex items-center justify-center z-10 transition-none ${
                  i < step
                    ? "bg-orange-500 border-orange-500 text-white border-2 rounded-full"
                    : i === step
                    ? isDark ? "bg-slate-900 border-orange-500 text-orange-500" : "bg-white border-orange-500 text-orange-500"
                    : isDark ? "border-gray-300 text-gray-400 bg-slate-900" : "border-gray-300 text-gray-400 bg-white"
                }`}
              >
                {i < step ? <Check size={14} /> : getIcon(label)}
              </div>

              {/* Step Label */}
              <span
                className={`mt-2 text-sm text-center ${
                  i === step
                    ? "text-orange-600 font-medium"
                    : "text-gray-500 font-normal"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div className={`p-8 rounded-xl shadow border flex flex-col justify-between ${isDark ? "bg-[#0a0a0f] text-gray-300 border-slate-700" : "bg-white border-gray-200 text-gray-950"}`}
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {step === 0 && (
              <DoctorInformation form={form} handleChange={handleChange} isDark={isDark} />
            )}

            {step === 1 && (
              <div className="text-gray-600 text-center py-8">
                <PatientScheduler form={form} handleChange={handleChange} isDark={isDark} />
              </div>
            )}
            {step === 2 && (
              <div className="text-gray-600 text-center py-8">
                <DegreeInformation form={form} onFilesSelect={handleFilesSelect} isDark={isDark} />
              </div>
            )}
            {step === 3 && (
              <div className={`text-center py-8 flex gap-5 justify-center items-center ${isDark ? "text-gray-100" : "text-gray-700"}`}>
                <CircleCheck className="text-green-500" /> 
                <p>Hoàn tất tạo tài khoản phòng khám!</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={back}
                  className={`px-4 py-2 border rounded-md ${isDark ? "hover:bg-gray-900" : "hover:bg-gray-100"}`}
                >
                  Quay lại
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  onClick={next}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  Tiếp theo
                </button>
              ) : (
                <button onClick={showInfo} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                  Hoàn tất
                </button>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  )
}
