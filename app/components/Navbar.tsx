"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navbar Component for Raahi Application
 *
 * A responsive navigation bar with:
 * - Logo/brand name with tagline on hover
 * - Navigation links with active route highlighting
 * - Mobile hamburger menu
 * - Sticky positioning
 * - Government portal styling
 */
function Navbar() {
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Get current pathname for active route highlighting
  const pathname = usePathname();

  /**
   * Check if a route is currently active
   * @param {string} path - The route path to check
   * @returns {boolean} - True if the route is active
   */
  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  /**
   * Toggle mobile menu open/closed
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Close mobile menu when a link is clicked
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation links configuration
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/admin", label: "Admin Dashboard", mobileLabel: "Admin" },
  ];

  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUserRole(localStorage.getItem("userRole"));
    };
    updateAuth();
    window.addEventListener("storage", updateAuth);
    return () => window.removeEventListener("storage", updateAuth);
  }, []);

  const visibleLinks = navLinks.filter((link) => {
    if (link.path === "/") return true;
    if (link.path === "/civilian") return isLoggedIn && userRole === "civilian";
    if (link.path === "/admin") return isLoggedIn && userRole === "admin";
    return true;
  });

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo/Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
            onClick={closeMobileMenu}
          >
            {/* Logo Icon */}
            <div className="bg-white rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-blue-900"
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

            {/* Brand Name with Tagline */}
            <div className="relative">
              <span className="text-2xl font-bold tracking-wide">Raahi</span>

              {/* Tagline - Appears on hover (desktop only) */}
              <span className="hidden md:block absolute top-full left-0 mt-1 text-xs text-blue-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Safer Roads, Smarter Reporting
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleLinks.map((link, index) => (
              <Link
                key={`${link.path}-${index}`}
                href={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-blue-700 text-white border-b-2 border-blue-300"
                    : "hover:bg-blue-700 hover:text-blue-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth-aware Button - Highlighted */}
            {!isLoggedIn ? (
              <Link
                href="/login"
                className={`ml-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive("/login")
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                }`}
              >
                Login
              </Link>
            ) : (
              <Link
                href={userRole === "admin" ? "/admin" : "/civilian"}
                className={`ml-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive(userRole === "admin" ? "/admin" : "/civilian")
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {userRole === "admin"
                  ? "Admin Dashboard"
                  : "Civilian Dashboard"}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {/* Hamburger Icon */}
            {!isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              // Close Icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu - Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              {visibleLinks.map((link, index) => (
                <Link
                  key={`mobile-${link.path}-${index}`}
                  href={link.path}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-blue-700 text-white border-l-4 border-blue-300"
                      : "hover:bg-blue-700 hover:text-blue-100"
                  }`}
                >
                  {link.mobileLabel || link.label}
                </Link>
              ))}

              {/* Auth-aware Button - Mobile */}
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isActive("/login")
                      ? "bg-green-600 text-white border-l-4 border-green-300"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  Login
                </Link>
              ) : (
                <Link
                  href={userRole === "admin" ? "/admin" : "/civilian"}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isActive(userRole === "admin" ? "/admin" : "/civilian")
                      ? "bg-green-600 text-white border-l-4 border-green-300"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {userRole === "admin"
                    ? "Admin Dashboard"
                    : "Civilian Dashboard"}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tagline for mobile - Below navbar */}
      <div className="md:hidden bg-blue-800 px-4 py-2 text-center">
        <span className="text-xs text-blue-200">
          Safer Roads, Smarter Reporting
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
