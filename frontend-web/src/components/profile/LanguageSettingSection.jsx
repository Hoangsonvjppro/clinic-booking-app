import { useState } from "react";

export default function LanguageSection() {
  const [lang, setLang] = useState("vi");

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Ngôn ngữ
      </h2>

      <div className="space-y-4">
        {/* Tiếng Việt */}
        <div
          className="flex justify-between items-center p-4 border rounded-xl"
          onClick={() => setLang("vi")}
        >
          <p className="font-medium">Tiếng Việt</p>
          <input
            type="radio"
            checked={lang === "vi"}
            onChange={() => setLang("vi")}
          />
        </div>

        {/* English */}
        <div
          className="flex justify-between items-center p-4 border rounded-xl"
          onClick={() => setLang("en")}
        >
          <p className="font-medium">English</p>
          <input
            type="radio"
            checked={lang === "en"}
            onChange={() => setLang("en")}
          />
        </div>
      </div>
    </div>
  );
}
