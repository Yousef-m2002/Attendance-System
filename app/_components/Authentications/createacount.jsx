"use client";
import validator from "validator";
import { useState } from "react";
import Swal from "sweetalert2";
import { getNames, getCode } from "country-list";

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
    nationality: "EG",
    gender: "male",
    phone: "",
  };
  const [errors, setErrors] = useState({});
  const validateField = (name, value) => {
    let error = "";

    if (name === "firstName" || name === "lastName") {
      const nameRegex = /^[\p{L}\s-]{2,25}$/u;
      if (!nameRegex.test(value)) {
        error = "⚠️ Name must contain (2-25 characters).";
      }
    }

    if (name === "email" && !validator.isEmail(value)) {
      error = "⚠️ Invalid email!";
    }

    if (
      name === "nationalId" &&
      (!validator.isNumeric(value) || value.length !== 14)
    ) {
      error = "⚠️ The national number must be 14 digits.";
    }

    if (name === "phone" && !validator.isMobilePhone(value, "ar-EG")) {
      error = "⚠️ The phone number must be 11 digits long and start with 01.";
    }

    if (
      name === "password" &&
      !validator.isStrongPassword(value, {
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      error =
        "⚠️Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    if (name === "confirmPassword" && value !== formData.password) {
      error = "⚠️ Passwords do not match!";
    }

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "❌ error!",
        text: "Passwords do not match, please consider this before continuing.",
        confirmButtonText: "Okay, I'll try again.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("FirstName", formData.firstName);
      formDataToSend.append("LastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("nationalId", formData.nationalId);
      formDataToSend.append("nationality", formData.nationality);
      formDataToSend.append("PhoneNumber", formData.phone);
      formDataToSend.append("sex", formData.gender);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("ConfirmPassword", formData.confirmPassword);

      console.log(formData.nationality);

      const res = await fetch(
        "https://baseattendence.runasp.net/api/Auth/Register",
        {
          method: "POST",
          body: formDataToSend, // No need for Content-Type when using FormData
        }
      );

      // const data = await res.text();
      // console.log("📥 Response Data:", data);

      if (!res.ok) {
        throw new Error(res?.message || "❌ An unexpected error occurred!");
      }

      const responseData = await res.text();
      const partialResponse = responseData.substring(29);

      Swal.fire({
        icon: "success",
        title: "🎉 Registration completed successfully!",
        text: partialResponse,
        confirmButtonText: "Start now",
        confirmButtonColor: "#28a745",
      });

      setFormData(initialState);
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire({
        icon: "error",
        title: "❌ error!",
        text:
          responseData ||
          "An error occurred while processing your request, please try again later.",
        confirmButtonText: "Good",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background:
          "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/back11.jpg')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
      className="flex justify-center items-center text-white min-h-screen w-full px-4 py-8"
    >
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl w-full max-w-[520px] border border-white/10 shadow-xl hover:shadow-[0_0_30px_rgba(94,114,228,0.3)] transition-all duration-500"
      >
        <div className="text-center mb-8">
          <h2
            style={{ fontFamily: "'Cairo', sans-serif" }}
            className="text-white mb-2 text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent"
          >
            Create a new account
          </h2>
          <p className="text-white/70">
            Fill out the form below to get started
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                name="firstName"
                required
                placeholder="first name"
                onChange={handleChange}
                value={formData.firstName}
                className="w-full pl-4 pr-3 py-3 bg-white/5 border border-white/15 placeholder:text-white/50 text-white focus:ring-2 focus:ring-blue-400/50 focus:outline-none rounded-lg transition-all duration-200"
              />
              {errors.firstName && (
                <div className="min-h-[20px]">
                  {" "}
                  {/* هذه المساحة الثابتة تمنع زحزحة العناصر */}
                  <p className="text-red-300 text-xs mt-2 w-full">
                    {errors.firstName}
                  </p>
                </div>
              )}
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                name="lastName"
                required
                placeholder="last name"
                onChange={handleChange}
                value={formData.lastName}
                className="w-full pl-4 pr-3 py-3 bg-white/5 border border-white/15 placeholder:text-white/50 text-white focus:ring-2 focus:ring-blue-400/50 focus:outline-none rounded-lg transition-all duration-200"
              />
              {errors.lastName && (
                <div className="min-h-[20px]">
                  {" "}
                  {/* هذه المساحة الثابتة تمنع زحزحة العناصر */}
                  <p className="text-red-300 text-xs mt-2 w-full">
                    {errors.lastName}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              placeholder="e-mail"
              autoComplete="off"
              onChange={handleChange}
              value={formData.email}
              className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/15 placeholder:text-white/50 text-white focus:ring-2 focus:ring-blue-400/50 focus:outline-none rounded-lg transition-all duration-200"
            />
            {errors.email && (
              <p className="absolute -bottom-5 left-0 text-red-300 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/15 rounded-lg">
            <span className="text-white/70">Gender</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="appearance-none w-5 h-5 rounded-full border-2 border-white/30 checked:bg-blue-500 checked:border-blue-500 transition-all duration-200"
                />
                <span>male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="appearance-none w-5 h-5 rounded-full border-2 border-white/30 checked:bg-pink-500 checked:border-pink-500 transition-all duration-200"
                />
                <span>feminine</span>
              </label>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <input
              type="tel"
              name="nationalId"
              placeholder="National identity"
              onChange={handleChange}
              value={formData.nationalId}
              className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/15 placeholder:text-white/50 text-white focus:ring-2 focus:ring-blue-400/50 focus:outline-none rounded-lg transition-all duration-200"
            />
            {errors.nationalId && (
              <p className="absolute -bottom-5 left-0 text-red-300 text-xs mt-1">
                {errors.nationalId}
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/15 text-white appearance-none rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all duration-200"
            >
              {getNames().map((country) => {
                const countryCode = getCode(country);
                const flagEmoji = countryCode
                  ? String.fromCodePoint(
                      ...[...countryCode.toUpperCase()].map(
                        (c) => 127397 + c.charCodeAt(0)
                      )
                    )
                  : "🏳";
                return (
                  <option
                    key={country}
                    value={countryCode}
                    className="bg-gray-800 text-white"
                  >
                    {country}
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              type="tel"
              name="phone"
              required
              placeholder="phone number"
              onChange={handleChange}
              value={formData.phone}
              className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/15 placeholder:text-white/50 text-white focus:ring-2 focus:ring-blue-400/50 focus:outline-none rounded-lg transition-all duration-200"
            />
            {errors.phone && (
              <p className="absolute -bottom-5 left-0 text-red-300 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-3 top-[25px] transform -translate-y-1/2 text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="password"
              autoComplete="off"
              required
              onChange={handleChange}
              value={formData.password}
              className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/15 placeholder:text-white/50 text-white focus:ring-2 focus:ring-blue-400/50 focus:outline-none rounded-lg transition-all duration-200"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[25px] transform -translate-y-1/2 cursor-pointer text-white/50 hover:text-white"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </span>
            {errors.password && (
              <div className="min-h-[20px]">
                {" "}
                {/* هذه المساحة الثابتة تمنع زحزحة العناصر */}
                <p className="text-red-300 text-xs mt-2 w-full">
                  {errors.password}
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              required
              onChange={handleChange}
              value={formData.confirmPassword}
              className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/15 placeholder:text-white/50 text-white focus:ring-2 focus:ring-blue-400/50 focus:outline-none rounded-lg transition-all duration-200"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white/50 hover:text-white"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </span>
            {errors.confirmPassword && (
              <p className=" relative  -bottom-5 left-0 text-red-300 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-400 to-indigo-600 cursor-pointer text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Account Registration"
              )}
            </button>
          </div>

          <div className="text-center mt-4 text-white/70">
            <a
              href="/login"
              className="text-blue-300 hover:text-blue-200 font-medium underline transition-colors duration-200"
            ></a>
          </div>
        </div>
      </form>
    </div>
  );
}
