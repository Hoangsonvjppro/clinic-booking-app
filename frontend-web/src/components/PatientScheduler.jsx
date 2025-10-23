import { motion } from "framer-motion"

export default function PatientScheduler({ form, handleChange }) {

  return (
    <div>
      {form.options.map((item) => {
        const checked = !!(form && form[item.key])

        return (
          <div key={item.key} className="flex items-center justify-between py-3 border-b-2 border-black">
            <span>{item.label}</span>

            <div
              className="w-11 h-6 rounded-full cursor-pointer relative flex items-center p-1"
              onClick={() =>
                handleChange &&
                handleChange({
                  target: {
                    name: item.key,
                    value: !checked,
                  },
                })
              }
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  backgroundColor: checked ? "#4caf50" : "#ccc",
                }}
                transition={{ duration: 0.25 }}
              />
              <motion.div
                className="z-10 relative bottom-[.4px] w-5 h-5 bg-white rounded-full shadow-md"
                animate={{
                  x: checked ? 18 : -2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
