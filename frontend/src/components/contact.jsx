import React from "react";


export const Contact = () => {
  return (
      <section className="product-home h-screen pt-20">
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">Get in Touch</h1>
        <p className="text-center text-gray-600 mb-10">
          We're here to answer any questions about your auction experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Send us a message</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  placeholder="Write your message..."
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Contact Information</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Email:</strong> support@yourauction.com
              </p>
              <p>
                <strong>Phone:</strong> +216 12 345 678
              </p>
              <p>
                <strong>Address:</strong> 123 Avenue de l’Enchère, Tunis, Tunisia
              </p>
              <p className="mt-6 text-sm text-gray-500">
                We usually reply within 24–48 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};
