import React, { useState } from 'react';
import Header from '../components/Header';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your backend integration here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full min-h-[calc(100vh-64px)] px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with our team for support or inquiries
          </p>
        </div>

        <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 px-4">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-10 h-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-base font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={8}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-10">
            <div className="bg-white rounded-xl shadow-lg p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <Mail className="h-8 w-8 text-blue-600 mt-1 mr-6" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
                    <p className="text-lg text-gray-600">support@rakshak.com</p>
                    <p className="text-lg text-gray-600">info@rakshak.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-8 w-8 text-blue-600 mt-1 mr-6" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Phone</h3>
                    <p className="text-lg text-gray-600">+91 1800-123-4567 (Toll Free)</p>
                    <p className="text-lg text-gray-600">+91 9876543210 (Helpline)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-8 w-8 text-blue-600 mt-1 mr-6" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Address</h3>
                    <p className="text-lg text-gray-600">
                      Rakshak Headquarters<br />
                      123 Relief Road, Disaster Management Complex<br />
                      New Delhi - 110001
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-8 w-8 text-blue-600 mt-1 mr-6" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Operating Hours</h3>
                    <p className="text-lg text-gray-600">24/7 Emergency Support</p>
                    <p className="text-lg text-gray-600">
                      Office Hours: Monday - Friday<br />
                      9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Emergency Support</h3>
              <p className="text-lg text-blue-700">
                For immediate emergency assistance, please call our 24/7 helpline at 1800-123-4567
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}