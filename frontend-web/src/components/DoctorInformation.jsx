import React, { useState } from "react"
import Modal from "react-modal"
import { motion, AnimatePresence } from "framer-motion"

export default function DoctorInformation( {form, handleChange} ) {
    const [showModal, setShowModal] = useState(false)

    const [addressForm, setAddressForm] = useState({
        fullName: form.doctorName || "",
        phone: form.phone || "",
        region: "",
        detail: "",
    })

    const openAddressModal = () => {
        setShowModal(true)
        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
        document.body.dataset.scrollY = String(scrollY);
    }
    
    const handleAddressChange = (e) => {
        const { name, value } = e.target
        setAddressForm((prev) => ({ ...prev, [name]: value }))
    }
    
    const handleSaveAddress = () => {
        handleChange({
        target: { name: "address", value: addressForm },
        })
        setShowModal(false)
    }

    return (
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium mb-1">
                * Tên của bạn
            </label>
            <input
                name="doctorName"
                value={form.doctorName}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                className="border rounded-md px-3 py-2 w-full"
                maxLength={30}
            />
            <div className="text-right text-xs text-gray-400">
                {form.doctorName.length}/30
            </div>
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">
                * Địa chỉ phòng khám
            </label>
            {form.address ? 
                <div>
                    <div>{form.address.fullName} | {form.address.phone}</div>
                    <div>{form.address.detail}</div>
                    <div>{form.address.region}</div>
                    <button onClick={openAddressModal} className="bg-none border-none text-sm font-semibold text-blue-500 underline">Chỉnh sửa</button>
                </div> :
                <button onClick={openAddressModal} className="border px-4 py-1 rounded-md hover:bg-gray-100">Thêm</button>
            }
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">* Email</label>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={form.email ? form.email : "example@gmail.com"}
                className="border rounded-md px-3 py-2 w-full bg-gray-50"
                readOnly
            />
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">
                * Số điện thoại
            </label>
            {form.phone ? 
            <div className="px-2">
                {form.phone}
            </div>
            :
            <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+84xxxxxxxxx"
                className="border rounded-md px-3 py-2 w-full"
                readOnly
            /> }
            </div>
            
            <AnimatePresence>
                <Modal
                    isOpen={showModal}
                    onRequestClose={() => setShowModal(false)}
                    overlayClassName="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-40 flex justify-center items-center z-50"
                    className="bg-white rounded-md shadow-lg p-6 w-xl outline-none"
                >
                    <motion.div className="p-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Sửa Địa chỉ</h2>
                            <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                            &times;
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Họ & Tên */}
                            <div>
                            <label className="block text-sm font-medium mb-1">Họ & Tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={addressForm.fullName}
                                onChange={handleAddressChange}
                                placeholder="Nhập họ và tên"
                                className="border rounded-md px-3 py-2 w-full"
                            />
                            </div>

                            {/* Số điện thoại */}
                            <div>
                            <label className="block text-sm font-medium mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={addressForm.phone}
                                onChange={handleAddressChange}
                                placeholder="+84xxxxxxxxx"
                                className="border rounded-md px-3 py-2 w-full"
                            />
                            </div>

                            {/* Địa chỉ */}
                            <div>
                            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                name="region"
                                value={addressForm.region}
                                onChange={handleAddressChange}
                                placeholder="Tỉnh/Thành phố/Quận/Huyện/Phường/Xã"
                                className="border rounded-md px-3 py-2 w-full"
                            />
                            </div>

                            {/* Địa chỉ chi tiết */}
                            <div>
                            <label className="block text-sm font-medium mb-1">
                                Địa chỉ chi tiết
                            </label>
                            <textarea
                                name="detail"
                                value={addressForm.detail}
                                onChange={handleAddressChange}
                                rows={3}
                                placeholder="Nhập địa chỉ chi tiết"
                                className="border rounded-md px-3 py-2 w-full resize-none"
                            />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                            onClick={() => setShowModal(false)}
                            className="px-5 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
                            >
                            Hủy
                            </button>
                            <button
                            onClick={handleSaveAddress}
                            className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                            >
                            Lưu
                            </button>
                        </div>
                    </motion.div>
                </Modal>
            </AnimatePresence>
        </div>
    )
}