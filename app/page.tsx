import ButtonHome1 from "./components/ui/buttonHome1";
import ButtonHome2 from "./components/ui/buttonHome2";
function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Report Road Issues.
              <br />
              Make India Safer.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Help improve road infrastructure by reporting potholes and road
              damage in your community. Together, we can make our roads safer
              for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ButtonHome1 />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Reporting road issues is simple and quick. Follow these three easy
              steps to help improve your community's infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                1. Click Photo
              </h3>
              <p className="text-gray-600">
                Take a clear photo of the pothole or road damage using your
                smartphone camera.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                2. Upload Complaint
              </h3>
              <p className="text-gray-600">
                Submit the photo with location details and a brief description
                through our platform.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                3. Authorities Repair
              </h3>
              <p className="text-gray-600">
                Local authorities receive the report and schedule repairs. Track
                progress in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Benefits for Citizens
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Raahi empowers every citizen to contribute to safer roads and
              better infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Benefit 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="text-blue-900 text-3xl mb-4">🚗</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Safer Roads
              </h3>
              <p className="text-gray-600 text-sm">
                Help prevent accidents by reporting dangerous road conditions
                promptly.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="text-green-700 text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Quick Response
              </h3>
              <p className="text-gray-600 text-sm">
                Direct reporting to authorities ensures faster resolution of
                issues.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
              <div className="text-orange-600 text-3xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600 text-sm">
                Monitor the status of your reports and see when repairs are
                completed.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <div className="text-purple-700 text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Community Impact
              </h3>
              <p className="text-gray-600 text-sm">
                Be part of a movement to improve infrastructure across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Reports Submitted</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5,000+</div>
              <div className="text-blue-200">Potholes Fixed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              Join thousands of citizens working together to improve India's
              road infrastructure.
            </p>
            <ButtonHome2 />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
