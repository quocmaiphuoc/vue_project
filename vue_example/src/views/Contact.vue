<script setup>
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-white p-8">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- Contact Information -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Email</p>
                  <p class="text-gray-900">contact@cgv.com</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Phone</p>
                  <p class="text-gray-900">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Address</p>
                  <p class="text-gray-900">123 Business Street<br>City, State 12345</p>
                </div>
              </div>
            </div>

            <!-- Office Hours -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Office Hours</h2>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Monday - Friday</span>
                  <span class="text-gray-900 font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Saturday</span>
                  <span class="text-gray-900 font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Sunday</span>
                  <span class="text-gray-900 font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
            <form class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="6"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
</template>

