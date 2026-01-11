"use client";
import { useState } from "react";
import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/utils/roles";
import { handleRegistration } from "./actions";

function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState("civilian");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();

  // Handle submission of the sign-up form

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      const value = await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      console.log(value);
      setVerifying(true);
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const handleVerifySubmit = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      await handleRegistration({
        clerkId: completeSignUp.createdUserId,
        name: `${firstName} ${lastName}`,
        phoneNumber: phoneNumber,
        email: emailAddress,
      });

      if (completeSignUp.status !== "complete") {
        // If it's not complete, it might be "missing_requirements"
        console.log("Status:", completeSignUp.status);
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        const is_Admin = emailAddress
          .trim()
          .toLowerCase()
          .endsWith("5@gmail.com");
        is_Admin ? router.push("/admin") : router.push("/civilian");
      }
    } catch (err: any) {
      console.log("Verification Error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome to Raahi
          </h1>
        </div>
        {/* Role Selection or Login Form */}
        <div className="max-w-md mx-auto">
          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div
                className={`${
                  selectedRole === "civilian" ? "bg-blue-100" : "bg-orange-100"
                } w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {selectedRole === "civilian" ? (
                  <svg
                    className="w-8 h-8 text-blue-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Register
              </h2>
              <p className="text-gray-600">Create your credentials</p>
            </div>

            {!verifying ? (
              <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
                {/* FirstName Field */}
                <div>
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="firstname"
                  />
                </div>
                {/* LastName Field */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="lastname"
                  />
                </div>
                {/* Phone Number Field */}
                <div>
                  <label
                    htmlFor="PhoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mobile No.
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNUmber"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Mobile Number"
                  />
                </div>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={emailAddress}
                    onChange={(e) => {
                      setEmailAddress(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Login Button */}
                <button
                  type={"submit"}
                  className={`w-full ${
                    selectedRole === "civilian"
                      ? "bg-blue-900 hover:bg-blue-800"
                      : "bg-orange-600 hover:bg-orange-700"
                  } text-white font-semibold py-3 rounded-lg transition-colors shadow-md`}
                >
                  Sign Up
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your password"
                  />
                </div>
                {/* Login Button */}
                <button
                  onClick={(e) => handleVerifySubmit(e)}
                  className={`w-full ${
                    selectedRole === "civilian"
                      ? "bg-blue-900 hover:bg-blue-800"
                      : "bg-orange-600 hover:bg-orange-700"
                  } text-white font-semibold py-3 rounded-lg transition-colors shadow-md`}
                >
                  Verify
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
