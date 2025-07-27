import { AlertCircle, Calendar, DollarSign, Package } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Donation } from '../types';

interface DonationFormProps {
  ngoId: string;
  ngoName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface DonationFormData {
  type: 'money' | 'food' | 'essentials' | 'other';
  amount?: number;
  description: string;
  quantity?: number;
  unit?: string;
  deliveryDate?: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ ngoId, ngoName, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [donationType, setDonationType] = useState<'money' | 'food' | 'essentials' | 'other'>('money');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<DonationFormData>({
    defaultValues: {
      type: 'money',
    },
  });

  const onSubmit = async (data: DonationFormData) => {
    setIsLoading(true);
    try {
      // Mock donation creation - in real app, save to Firebase
      const donation: Partial<Donation> = {
        ngoId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
        status: 'pending',
        ngoName,
        donorName: 'Current User', // Get from auth context
      };

      console.log('Creating donation:', donation);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Donation submitted successfully!');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Make a Donation</h2>
        <p className="text-gray-600">Donating to: <span className="font-medium">{ngoName}</span></p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Donation Type Selection */}
        <div>
          <label className="form-label">Donation Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: 'money', label: 'Money', icon: DollarSign },
              { type: 'food', label: 'Food', icon: Package },
              { type: 'essentials', label: 'Essentials', icon: Package },
              { type: 'other', label: 'Other', icon: Package },
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setDonationType(type as any)}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  donationType === type
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount/Quantity */}
        {donationType === 'money' ? (
          <div>
            <label htmlFor="amount" className="form-label">
              Amount (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                className="input-field pl-10"
                placeholder="Enter amount"
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 1, message: 'Amount must be at least $1' },
                })}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                className="input-field"
                placeholder="Enter quantity"
                {...register('quantity', {
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' },
                })}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="unit" className="form-label">
                Unit
              </label>
              <select
                id="unit"
                className="input-field"
                {...register('unit', { required: 'Unit is required' })}
              >
                <option value="">Select unit</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="pieces">Pieces</option>
                <option value="boxes">Boxes</option>
                <option value="bags">Bags</option>
                <option value="bottles">Bottles</option>
                <option value="other">Other</option>
              </select>
              {errors.unit && (
                <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="input-field"
            placeholder={`Describe your ${donationType} donation...`}
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters',
              },
            })}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Delivery Date */}
        <div>
          <label htmlFor="deliveryDate" className="form-label">
            Preferred Delivery Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="deliveryDate"
              type="date"
              className="input-field pl-10"
              min={new Date().toISOString().split('T')[0]}
              {...register('deliveryDate')}
            />
          </div>
        </div>

        {/* Information Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Information</p>
              <ul className="space-y-1">
                <li>• Your donation will be reviewed by the NGO</li>
                <li>• You'll receive updates on the donation status</li>
                <li>• Contact the NGO directly for delivery arrangements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 btn-primary"
          >
            {isLoading ? 'Submitting...' : 'Submit Donation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm; 