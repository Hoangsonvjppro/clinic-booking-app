import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency } from '../../utils/formatters';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const MomoQRCode = ({ paymentData, onRefresh, isLoading }) => {
  if (!paymentData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Loading payment information...</p>
      </div>
    );
  }

  const { qrCodeUrl, amount, orderId, payUrl } = paymentData;

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan to Pay</h2>
        <p className="text-gray-600">Use MoMo app to scan this QR code</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        {qrCodeUrl ? (
          <div className="p-4 bg-white border-4 border-primary-500 rounded-lg">
            <img src={qrCodeUrl} alt="MoMo QR Code" className="w-64 h-64" />
          </div>
        ) : payUrl ? (
          <div className="p-4 bg-white border-4 border-primary-500 rounded-lg">
            <QRCodeSVG value={payUrl} size={256} />
          </div>
        ) : (
          <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-lg">
            <p className="text-gray-400">QR Code not available</p>
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Amount</span>
          <span className="text-xl font-bold text-primary-600">
            {formatCurrency(amount)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Order ID</span>
          <span className="font-mono text-sm text-gray-700">{orderId}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">How to pay:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Open MoMo app on your phone</li>
          <li>Scan the QR code above</li>
          <li>Confirm the payment amount</li>
          <li>Enter your PIN to complete</li>
        </ol>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2 text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Checking...' : 'Check Payment Status'}
        </button>
      </div>

      {/* Alternative Payment Link */}
      {payUrl && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Or pay directly:</p>
          <a
            href={payUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            Pay with MoMo
          </a>
        </div>
      )}
    </div>
  );
};

export default MomoQRCode;
