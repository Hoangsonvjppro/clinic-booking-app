import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email address');

// Password validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Phone validation
export const phoneSchema = z
  .string()
  .regex(/^[0-9+\-() ]+$/, 'Invalid phone number')
  .min(10, 'Phone number must be at least 10 digits');

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Register schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: phoneSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Patient profile schema
export const patientProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phone: phoneSchema,
  email: emailSchema,
  address: z.string().min(5, 'Address is required'),
  emergencyContact: phoneSchema,
});

// Doctor application schema
export const doctorApplicationSchema = z.object({
  specialty: z.string().min(1, 'Specialty is required'),
  hospitalEmail: emailSchema.optional(),
  address: z.string().min(5, 'Address is required'),
  phone: phoneSchema,
  description: z.string().min(50, 'Description must be at least 50 characters'),
  certificates: z.any().refine((files) => files?.length > 0, 'At least one certificate is required'),
});

// Booking schema
export const bookingSchema = z.object({
  doctorId: z.string().uuid('Invalid doctor ID'),
  appointmentDate: z.string().min(1, 'Date is required'),
  appointmentTime: z.string().min(1, 'Time is required'),
  reasonForVisit: z.string().min(10, 'Please provide reason for visit (min 10 characters)'),
  notes: z.string().optional(),
});

// Validate email
export const validateEmail = (email) => {
  try {
    emailSchema.parse(email);
    return { valid: true };
  } catch (error) {
    return { valid: false, message: error.errors[0].message };
  }
};

// Validate password
export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password);
    return { valid: true };
  } catch (error) {
    return { valid: false, message: error.errors[0].message };
  }
};
