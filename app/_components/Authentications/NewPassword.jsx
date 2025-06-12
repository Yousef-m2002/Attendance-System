'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import validator from 'validator';

export default function NewPassword() {
    const [newPassword, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");
    const code = searchParams.get("code");

    useEffect(() => {
        console.log("Running useEffect - email:", email, "code:", code);
    }, [email, code]);

    const isValidPassword = (newPassword) => {
        return validator.isStrongPassword(newPassword, {
            minLength: 8,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
  
      if (!newPassword || !confirmPassword) {
          setError('Please fill out all fields');
          return;
      }
      if (newPassword !== confirmPassword) {
          setError('Passwords do not match');
          return;
      }
      if (!isValidPassword(newPassword)) {
          setError('Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.');
          return;
      }
  
      try {
          const response = await fetch(' https://baseattendence.runasp.net/api/Auth/ResetPassword', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email: email || '', 
                code: code || '', 
                newPassword: newPassword || '' 
            })
            
          });
  
          // console.log("Request Payload:", { email, code, newPassword });
          console.log("dada",JSON.stringify({ 
            email: email || '', 
            code: code || '', 
            newPassword: newPassword || '' 
        }))
  
        
          const clonedResponse = response.clone();
          let data;
          const contentType = response.headers.get("content-type");
          
          if (contentType && contentType.includes("application/json")) {
              data = await response.json();
          } else {
              data = { message: await response.text() }; 
          }
          
  
          console.log("Response Data:", data);
  
          if (!response.ok) {
              throw new Error(data.message || 'Something went wrong');
          }
  
          setSuccess('Password has been reset successfully!');
          setTimeout(() => {
              router.replace('/reset-password');
              router.push('auth/signin');
          }, 2000);
      } catch (err) {
          console.error("Error:", err);
          setError(err.message);
      }
  };
  
  

    return (  
        <div 
            className="flex flex-col items-center justify-center min-h-screen bg-slate-700 px-4"
            style={{
                backgroundImage: "url('/images/background_signUp.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                fontFamily: "Poppins, sans-serif" 
            }}
        >
            <div className="bg-[#FFFFFFB8] bg-opacity-75 p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-[90%] sm:max-w-[453px]">
                <h2 className="text-xl text-shadow drop-shadow-md py-5 rounded-[8px] text-[28px] sm:text-[32px] text-[#111827] mb-4 text-center">
                    Reset your password
                </h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[320px] sm:max-w-[389px] mx-auto">
                    <div className="w-full relative">
                        <label className='font-medium '>Enter a new password</label>
                        <input
                            type={showPassword1 ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={newPassword}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-[#E6D99A] focus:ring-2 focus:ring-yellow-400 my-3 shadow-[0px_4px_6px_rgba(0,0,0,0.25)]
                                        w-full h-[48px] sm:h-[51px] placeholder-gray-900 pl-[55px] sm:pl-[65px] pr-6 rounded-[8px] outline-none text-[14px] sm:text-[16px]"
                        />
                        <LockClosedIcon className="absolute border-2 p-2 bg-white text-gray-800 rounded-full left-2 sm:left-4 top-[62%] transform -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 shadow-md" />
                        <button
                            type="button"
                            onClick={() => setShowPassword1(!showPassword1)}
                            className="absolute right-3 sm:right-4 top-[62%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword1 ? <EyeSlashIcon className="h-5 sm:h-6 w-5 sm:w-6" /> : <EyeIcon className="h-5 sm:h-6 w-5 sm:w-6" />}
                        </button>
                    </div>
                    <div className="w-full relative mt-3">
                        <label className='font-medium '>Confirm a password</label>
                        <input
                            type={showPassword2 ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="border border-[#E6D99A] focus:ring-2 focus:ring-yellow-400 my-3 shadow-[0px_4px_6px_rgba(0,0,0,0.25)]
                                        w-full h-[48px] sm:h-[51px] placeholder-gray-900 pl-[55px] sm:pl-[65px] pr-6 rounded-[8px] outline-none text-[14px] sm:text-[16px]"
                        />
                        <LockClosedIcon className="absolute border-2 p-2 bg-white text-gray-800 rounded-full left-2 sm:left-4 top-[62%] transform -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 shadow-md" />
                        <button
                            type="button"
                            onClick={() => setShowPassword2(!showPassword2)}
                            className="absolute right-3 sm:right-4 top-[62%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword2 ? <EyeSlashIcon className="h-5 sm:h-6 w-5 sm:w-6" /> : <EyeIcon className="h-5 sm:h-6 w-5 sm:w-6" />}
                        </button>
                    </div>
                    <div className="w-full max-w-[189px] mx-auto h-[46px]">
                        <button type="submit" className="w-full h-full bg-[#E6D99A] rounded-[8px] cursor-pointer text-[#000000] text-[18px] sm:text-[20px] hover:bg-[#e6d99aa5] transition">
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
