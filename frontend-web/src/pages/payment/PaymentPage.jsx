import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from "axios"
import {QRCode} from "react-qr-code"

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [momo, setMomo] = useState({})

  // Get booking info from state or query params
  const bookingInfo = location.state?.booking || {
    id: searchParams.get('id') || 'BK-2024-001',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    date: '2024-12-05',
    time: '10:00 AM',
    consultationFee: 150,
    serviceFee: 5,
  };

  const total = bookingInfo.consultationFee + bookingInfo.serviceFee;

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon, description: 'Visa, Mastercard, Amex' },
    { id: 'bank', name: 'Bank Transfer', icon: BuildingLibraryIcon, description: 'Direct bank transfer' },
    { id: 'momo', name: 'MoMo Wallet', icon: DevicePhoneMobileIcon, description: 'Pay with MoMo' },
  ];

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = formatCardNumber(value.replace(/\D/g, '').slice(0, 16));
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value.replace(/\D/g, '').slice(0, 4));
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardForm(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

    if(momo.payUrl) {
      window.open(momo.payUrl)
      return
    }

    setProcessing(true);
    try {
      // TODO: Call payment API
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Payment successful!');
      navigate('/payment/complete', { 
        state: { 
          booking: bookingInfo,
          paymentMethod,
          transactionId: 'TXN-' + Date.now()
        } 
      });
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };


  const handlePay = async (e) => {
    setPaymentMethod(e)
    if (e === "momo" && !momo.payUrl) {
      const bookingString = bookingInfo.id + ", " + bookingInfo.doctorName + ', ' + bookingInfo.specialty;
      let makePayment = {
        amount: bookingInfo.consultationFee * 26372.50,
        orderInfo: bookingString
      }
      axios.post('http://localhost:8080/api/momo/create', makePayment)
      .then(function(response) {
        console.log(response)
        setMomo(response.data)
      })
      .catch(function(err) {
        console.log("MoMo API Error:", err.response?.data || err);
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Complete Payment</h1>
          <p className="text-slate-600 mt-2">Secure payment for your appointment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Payment Methods */}
              <div className="bg-white rounded-xl p-6 shadow-card mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => handlePay(e.target.value)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        paymentMethod === method.id ? 'bg-primary-100' : 'bg-slate-100'
                      }`}>
                        <method.icon className={`w-5 h-5 ${
                          paymentMethod === method.id ? 'text-primary-600' : 'text-slate-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{method.name}</p>
                        <p className="text-sm text-slate-500">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="bg-white rounded-xl p-6 shadow-card mb-6 animate-fade-in">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Card Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="number"
                          value={cardForm.number}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          className="input-field pl-12"
                        />
                        <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={cardForm.name}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardForm.expiry}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardForm.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Info */}
              {paymentMethod === 'bank' && (
                <div className="bg-white rounded-xl p-6 shadow-card mb-6 animate-fade-in">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Bank Transfer Details</h2>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Bank Name</span>
                      <span className="font-medium">VietcomBank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Account Number</span>
                      <span className="font-medium font-mono">1234567890123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Account Name</span>
                      <span className="font-medium">CLINIC BOOKING JSC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Transfer Content</span>
                      <span className="font-medium text-primary-600">{bookingInfo.id}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-4">
                    Please transfer the exact amount with the booking ID as transfer content. 
                    Your appointment will be confirmed within 24 hours after payment verification.
                  </p>
                </div>
              )}

              {/* MoMo QR */}
              {paymentMethod === 'momo' && (
                <div className="bg-white rounded-xl p-6 shadow-card mb-6 animate-fade-in">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">MoMo Payment</h2>
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                      <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center p-2">
                        {momo.qrCodeUrl
                        ? <QRCode className="text-pink-600 font-bold" value={momo?.qrCodeUrl} size={256} />
                        : <span className="text-pink-600 font-bold">QR Code</span>
                        }
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      Scan this QR code with MoMo app to pay
                    </p>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-medical-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <ShieldCheckIcon className="w-6 h-6 text-medical-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-medical-800">Secure Payment</p>
                  <p className="text-sm text-medical-600">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="w-5 h-5" />
                    Pay ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Booking Summary</h2>
              
              {/* Doctor Info */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{bookingInfo.doctorName}</p>
                  <p className="text-sm text-slate-500">{bookingInfo.specialty}</p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">
                    {new Date(bookingInfo.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{bookingInfo.time}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Consultation Fee</span>
                  <span className="font-medium">${bookingInfo.consultationFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Service Fee</span>
                  <span className="font-medium">${bookingInfo.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-xl text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}