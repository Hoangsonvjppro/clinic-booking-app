import React, { useState, useCallback, useRef, useEffect } from "react";
import { X } from "lucide-react";

export default function DegreeInformation({ form, onFilesSelect, isDark }) {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState(form.files || []);
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInput = useRef();

    useEffect(() => {
        onFilesSelect && onFilesSelect(files);
    }, [files]);

    useEffect(() => {
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [files, onFilesSelect]);

    const handleFiles = (selectedFiles) => {
        const newFiles = Array.from(selectedFiles);
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const removeImage = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    }, []);

    const handleDrop = useCallback(
        (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.length > 0) handleFiles(e.dataTransfer.files);
        },
        []
    );

    return (
      <div className={`flex flex-col justify-center items-center min-h-[250px] ${isDark ? "bg-[#0a0a0f] text-gray-300" : "bg-white text-gray-950"}`}>
        <form
          onDragEnter={handleDrag}
          onSubmit={(e) => e.preventDefault()}
          className={`relative w-full max-w-2xl border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input
            accept="image/*"
            multiple
            ref={fileInput}
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center">
            <p className={`font-medium ${isDark ? "text-gray-100" : "text-gray-700"}`}>Chọn hoặc kéo thả các file ảnh</p>
            <button
              type="button"
              onClick={() => fileInput.current.click()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Chọn file
            </button>
          </label>

          {previewUrls.length > 0 && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-full h-32 object-cover rounded-md border" />
                  <button type="button" onClick={() => {removeImage(i)}} className="absolute top-1 right-1 hover:bg-white/50 hover:border-black/20 border-1 border-transparent rounded-full p-1 transition-all duration-75">
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>

          {dragActive && (
              <div
                  className="absolute inset-0"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
              />
          )}
      </div>
    );
}
