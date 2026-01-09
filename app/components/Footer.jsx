import Link from "next/link";

/**
 * Footer Component for Raahi Application
 *
 * A comprehensive footer with:
 * - About section with platform description
 * - Quick navigation links
 * - Contact information and disclaimer
 * - Bottom copyright bar
 * - Government civic-tech styling
 * - Fully responsive design
 */
function Footer() {
  // Current year for copyright
  const currentYear = new Date().getFullYear();

  // Quick links configuration
  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/civilian", label: "Report Pothole" },
    { path: "/civilian", label: "Civilian Dashboard" },
    { path: "/admin", label: "Admin Portal" },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1: About Raahi */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              {/* Logo Icon */}
              <div className="bg-blue-600 rounded-lg p-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Raahi</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Raahi is a citizen-driven platform to report road issues and
              improve infrastructure safety across India.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-sm hover:text-white transition-colors duration-200 hover:underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Contact & Info */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact & Info
            </h4>
            <ul className="space-y-3 text-sm">
              {/* Email */}
              <li className="flex items-start justify-center md:justify-start gap-2">
                <svg
                  className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:support@raahi.gov.in"
                  className="hover:text-white transition-colors duration-200"
                >
                  support@raahi.gov.in
                </a>
              </li>

              {/* Location */}
              <li className="flex items-start justify-center md:justify-start gap-2">
                <svg
                  className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>India</span>
              </li>

              {/* Helpline */}
              <li className="flex items-start justify-center md:justify-start gap-2">
                <svg
                  className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Helpline: 1800-RAAHI-00</span>
              </li>
            </ul>

            {/* Disclaimer */}
            <div className="mt-6 p-3 bg-gray-700 rounded-lg border border-gray-600">
              <p className="text-xs text-gray-400 italic">
                <span className="font-semibold text-yellow-400">
                  Disclaimer:
                </span>{" "}
                This is a demo civic-tech platform.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 mb-6"></div>

        {/* Social Links / Additional Info (Optional) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-400">Government Verified Platform</span>
          </div>

          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="/accessibility"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} Raahi. All rights reserved.
            </p>

            {/* Built for public good badge */}
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-gray-400">Built for public good</p>
            </div>

            {/* Government of India Badge */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
                🇮🇳 Digital India Initiative
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
