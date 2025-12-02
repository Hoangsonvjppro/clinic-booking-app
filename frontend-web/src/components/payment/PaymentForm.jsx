import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatters';

const paymentFormSchema = z.object({
  amount: z.number().min(1, 'Amount is required'),
  description: z.string().optional(),
});

const PaymentForm = ({ appointmentId, amount, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount,
      description: `Payment for appointment #${appointmentId}`,
    },
  });

  const onFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      await onSubmit({
        appointmentId,
        amount: data.amount,
        description: data.description,
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-100 rounded-lg">
          <CreditCardIcon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
          <p className="text-sm text-gray-600">Complete your payment via MoMo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              readOnly
              className="input-field pl-8 bg-gray-50"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
          <p className="mt-2 text-lg font-semibold text-primary-600">
            Total: {formatCurrency(amount)}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Description
          </label>
          <input
            type="text"
            {...register('description')}
            className="input-field"
            placeholder="Payment for appointment"
          />
        </div>

        {/* Payment Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Payment Information</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>You will be redirected to MoMo payment gateway</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Scan the QR code with your MoMo app to complete payment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Payment confirmation will be sent to your email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Your appointment will be confirmed after successful payment</span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCardIcon className="w-5 h-5" />
              Proceed to Payment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
