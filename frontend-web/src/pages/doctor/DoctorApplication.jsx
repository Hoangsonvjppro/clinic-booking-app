import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  PhotoIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axios from "axios"

export default function DoctorApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    photo: null,
    
    // Professional Info
    specialty: '',
    experience: '',
    licenseNumber: '',
    licenseExpiry: '',
    education: '',
    hospital: '',
    
    // Documents
    licenseDoc: null,
    degreeDoc: null,
    idDoc: null,
    
    // Bio
    bio: '',
    languages: [],
    consultationFee: '',
  });

  const steps = [
    { id: 1, name: 'Personal Info', icon: UserIcon },
    { id: 2, name: 'Professional', icon: BriefcaseIcon },
    { id: 3, name: 'Documents', icon: DocumentTextIcon },
    { id: 4, name: 'Review', icon: CheckCircleIcon },
  ];

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Medicine', 'Neurology', 'Oncology', 'Ophthalmology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Pulmonology',
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLanguageToggle = (lang) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get("http://localhost:8080/api/v1/auth/me", {
        headers: {Authorization: `Bearer ${token}`}
      })
      const user = res.data
      const addressString = form.address
      ? `hospital-name:${form.hospital},${form.address}, phone:${form.phone}`
      : "";
      const paymentMethods = [];
      if (form.dateOfBirth) paymentMethods.push(form.dateOfBirth)
      if (form.gender) paymentMethods.push(form.gender)
      if (form.specialty) paymentMethods.push(form.specialty)
      if (form.experience) paymentMethods.push(form.experience)
      if (form.licenseNumber) paymentMethods.push(form.licenseNumber)
      if (form.licenseExpiry) paymentMethods.push(form.licenseExpiry)
      if (form.education) paymentMethods.push(form.education)
      if (form.consultationFee) paymentMethods.push(form.consultationFee)
      for (const lan of form.languages) {
        paymentMethods.push(lan)
      }
      const payload = {
        userId: user.id,
        name: form.fullName,
        hospitalEmail: user.email,
        address: addressString,
        phone: form.phone,
        description: form.bio,
        paymentMethods: paymentMethods.join(","),
      };

      // Create FormData
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      // --- ADD FILES (BACKEND EXPECTS certificates[]) ---
      if (form.photo) formData.append("certificates", form.photo);
      if (form.licenseDoc) formData.append("certificates", form.licenseDoc);
      if (form.degreeDoc) formData.append("certificates", form.degreeDoc);
      if (form.idDoc) formData.append("certificates", form.idDoc);

      const response = await axios.post(
        "http://localhost:8080/api/doctor/apply",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // TODO: Call API to submit application
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Application submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Join Our Medical Team</h1>
          <p className="text-slate-600 mt-2">Complete your application to become a registered doctor</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl p-6 shadow-card mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-slate-400'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-card animate-fade-in">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                      {form.photo ? (
                        <img src={URL.createObjectURL(form.photo)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <PhotoIcon className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <label className="btn-outline py-2 px-4 cursor-pointer">
                      <input type="file" name="photo" accept="image/*" onChange={handleChange} className="hidden" />
                      Upload Photo
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="input-field" required>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="input-field" required />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Info */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl p-6 shadow-card animate-fade-in">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Professional Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialty *</label>
                  <select name="specialty" value={form.specialty} onChange={handleChange} className="input-field" required>
                    <option value="">Select specialty</option>
                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience *</label>
                  <input type="number" name="experience" value={form.experience} onChange={handleChange} min="0" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medical License Number *</label>
                  <input type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License Expiry Date *</label>
                  <input type="date" name="licenseExpiry" value={form.licenseExpiry} onChange={handleChange} className="input-field" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Education & Qualifications *</label>
                  <textarea name="education" value={form.education} onChange={handleChange} rows={3} placeholder="MD from ABC Medical School (2015)..." className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Hospital/Clinic</label>
                  <input type="text" name="hospital" value={form.hospital} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fee ($) *</label>
                  <input type="number" name="consultationFee" value={form.consultationFee} onChange={handleChange} min="0" className="input-field" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'Vietnamese', 'Chinese', 'French', 'Spanish', 'Japanese'].map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleLanguageToggle(lang)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          form.languages.includes(lang)
                            ? 'bg-primary-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Professional Bio *</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Tell us about your experience and approach to patient care..." className="input-field" required />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl p-6 shadow-card animate-fade-in">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Required Documents</h2>
              <div className="space-y-6">
                {[
                  { name: 'licenseDoc', label: 'Medical License', desc: 'Upload a clear copy of your valid medical license' },
                  { name: 'degreeDoc', label: 'Medical Degree', desc: 'Upload your medical degree certificate' },
                  { name: 'idDoc', label: 'Government ID', desc: 'Upload a valid government-issued ID' },
                ].map((doc) => (
                  <div key={doc.name} className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-primary-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <CloudArrowUpIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{doc.label} *</h3>
                        <p className="text-sm text-slate-500">{doc.desc}</p>
                        {form[doc.name] ? (
                          <div className="mt-2 flex items-center gap-2 text-sm text-medical-600">
                            <CheckCircleIcon className="w-4 h-4" />
                            {form[doc.name].name}
                            <button
                              type="button"
                              onClick={() => setForm(prev => ({ ...prev, [doc.name]: null }))}
                              className="text-red-500 hover:text-red-600"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="inline-block mt-2 text-primary-600 font-medium text-sm cursor-pointer hover:underline">
                            <input type="file" name={doc.name} onChange={handleChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                            Choose file
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="bg-white rounded-xl p-6 shadow-card animate-fade-in">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Review Your Application</h2>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-500">Name:</span> {form.fullName || '-'}</div>
                    <div><span className="text-slate-500">Email:</span> {form.email || '-'}</div>
                    <div><span className="text-slate-500">Phone:</span> {form.phone || '-'}</div>
                    <div><span className="text-slate-500">Gender:</span> {form.gender || '-'}</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3">Professional Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-500">Specialty:</span> {form.specialty || '-'}</div>
                    <div><span className="text-slate-500">Experience:</span> {form.experience ? `${form.experience} years` : '-'}</div>
                    <div><span className="text-slate-500">License:</span> {form.licenseNumber || '-'}</div>
                    <div><span className="text-slate-500">Fee:</span> {form.consultationFee ? `$${form.consultationFee}` : '-'}</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-700 mb-3">Documents</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {form.licenseDoc ? <CheckCircleIcon className="w-4 h-4 text-medical-600" /> : <XMarkIcon className="w-4 h-4 text-red-500" />}
                      Medical License
                    </div>
                    <div className="flex items-center gap-2">
                      {form.degreeDoc ? <CheckCircleIcon className="w-4 h-4 text-medical-600" /> : <XMarkIcon className="w-4 h-4 text-red-500" />}
                      Medical Degree
                    </div>
                    <div className="flex items-center gap-2">
                      {form.idDoc ? <CheckCircleIcon className="w-4 h-4 text-medical-600" /> : <XMarkIcon className="w-4 h-4 text-red-500" />}
                      Government ID
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> By submitting this application, you confirm that all information provided is accurate. 
                    Our team will review your application and contact you within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-outline py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {currentStep < 4 ? (
              <button type="button" onClick={nextStep} className="btn-primary py-3 px-8">
                Continue
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="btn-success py-3 px-8 flex items-center gap-2">
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}