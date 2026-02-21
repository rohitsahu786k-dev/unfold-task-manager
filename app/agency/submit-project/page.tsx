'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import DashboardLayout from '@/app/components/DashboardLayout';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

type FormStep = 'initial' | 'details' | 'confirmation' | 'success';
type PricingModel = 'fixed' | 'hourly' | 'retainer' | '';

interface ProjectFormData {
  projectName: string;
  projectDescription: string;
  requirementNotes: string;
  budget: string;
  pricingModel: PricingModel;
  deliveryDeadline: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export default function AgencyProjectIntakePage() {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<FormStep>('initial');
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    projectDescription: '',
    requirementNotes: '',
    budget: '',
    pricingModel: '',
    deliveryDeadline: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 'initial') {
      if (formData.projectName && formData.projectDescription && formData.requirementNotes) {
        setStep('details');
      }
    } else if (step === 'details') {
      if (formData.budget && formData.pricingModel && formData.deliveryDeadline) {
        setStep('confirmation');
      }
    }
  };

  const handleSubmit = () => {
    // Here we would submit to the backend
    console.log('Project intake submitted:', formData);
    setStep('success');
  };

  const handleBackStep = () => {
    if (step === 'details') setStep('initial');
    else if (step === 'confirmation') setStep('details');
  };

  // Check if user is agency user
  if (currentUser.role !== 'agency_user') {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only agency users can submit project intake forms.</p>
          <Link href="/projects" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            ← Back to Projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (step === 'success') {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Link href="/projects" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className="rounded-lg border border-green-200 bg-green-50 p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Submitted Successfully</h1>
            <p className="text-gray-600 text-lg mb-8">
              Thank you for submitting your project. Our team will review your intake and get back to you within 24 hours.
            </p>

            <div className="bg-white rounded-lg p-6 mb-8 text-left border border-green-200">
              <h2 className="font-semibold text-gray-900 mb-4">Project Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Project Name:</span>
                  <span className="font-medium text-gray-900">{formData.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium text-gray-900">${formData.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pricing Model:</span>
                  <span className="font-medium text-gray-900 capitalize">{formData.pricingModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium text-gray-900">{new Date(formData.deliveryDeadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Confirmation email has been sent to: <span className="font-medium">{formData.contactEmail}</span>
              </p>
              <div className="flex gap-3">
                <Link href="/projects" className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  View My Projects
                </Link>
                <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Link href="/projects" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit New Project</h1>
          <p className="text-gray-600 mt-2">Complete this form to submit a new project for our team.</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
              ['initial', 'details', 'confirmation', 'success'].includes(step)
                ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 rounded ${
              ['details', 'confirmation', 'success'].includes(step) ? 'bg-green-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
              ['details', 'confirmation', 'success'].includes(step) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 rounded ${
              ['confirmation', 'success'].includes(step) ? 'bg-green-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
              ['confirmation', 'success'].includes(step) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Project Details</span>
            <span>Budget & Timeline</span>
            <span>Review & Submit</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          {/* Step 1: Initial Details */}
          {step === 'initial' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="e.g., E-commerce Website Redesign"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  placeholder="Describe what you need for this project..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Requirements & Additional Notes *
                </label>
                <textarea
                  name="requirementNotes"
                  value={formData.requirementNotes}
                  onChange={handleInputChange}
                  placeholder="List specific requirements, features, or any other important details..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Budget & Timeline */}
          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Budget *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">$</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Pricing Model *
                </label>
                <select
                  name="pricingModel"
                  value={formData.pricingModel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select pricing model --</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="retainer">Retainer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Delivery Deadline *
                </label>
                <input
                  type="date"
                  name="deliveryDeadline"
                  value={formData.deliveryDeadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Please provide your contact information below so we can reach out regarding your project.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Review Summary */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Project Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project:</span>
                    <span className="font-medium text-gray-900">{formData.projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium text-gray-900">${formData.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium text-gray-900 capitalize">{formData.pricingModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium text-gray-900">{new Date(formData.deliveryDeadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBackStep}
              disabled={step === 'initial'}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {step !== 'confirmation' ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 'initial' && (!formData.projectName || !formData.projectDescription || !formData.requirementNotes)) ||
                  (step === 'details' && (!formData.budget || !formData.pricingModel || !formData.deliveryDeadline))
                }
                className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.contactName || !formData.contactEmail}
                className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Project
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
