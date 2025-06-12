"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaSignOutAlt,

} from 'react-icons/fa';
const handleLogout = () => {
  localStorage.clear();

}
const DoctorP = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("User"))?.tokens;
    const fetchDoctorData = async () => {
      try {
        const response = await fetch(
          "https://baseattendence.runasp.net/api/Doctors/Get",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("فشل في تحميل البيانات من السيرفر");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("خطأ:", err);
        setError("حصلت مشكلة أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  if (loading) return <p>جارٍ تحميل البيانات...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data)
    return (
      <div className="flex justify-center items-center h-screen" dir="rtl">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-500 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-700">
            فشل في تحميل البيانات
          </h3>
          <p className="text-red-600 mt-2">الرجاء المحاولة مرة أخرى لاحقًا</p>
        </div>
      </div>
    );

  const { applicationUser, subjects } = data;

  return (
    <div
      dir="rtl"
      className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl space-y-8 text-right"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          بيانات الدكتور
        </h2>
        <div className="w-20 h-1 mx-auto mt-3 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full"></div>
      </div>

      {/* صورة الدكتور */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-blue-100/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoItem
            label="الاسم"
            value={`${applicationUser.firstName || "غير متوفر"} ${
              applicationUser.lastName || ""
            }`}
          />
          <InfoItem
            label="البريد الإلكتروني"
            value={applicationUser.email || "غير متوفر"}
          />
          <InfoItem
            label="رقم الهاتف"
            value={applicationUser.phoneNumber || "غير متوفر"}
          />
          <InfoItem
            label="الرقم القومي"
            value={applicationUser.nationalId || "غير متوفر"}
          />
        </div>
      </div>

      {/* المواد التي يدرسها */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-blue-700 border-r-4 border-blue-400 pr-3">
          المواد التي يدرسها
        </h3>
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 transform hover:-translate-y-1 group"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xl font-bold text-blue-800 group-hover:text-blue-600 transition-colors">
                {subject.name}
              </h4>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {subject.levelName}
              </span>
            </div>

            <div className="mb-3">
              <span className="inline-flex items-center bg-blue-50 text-blue-800 text-sm px-3 py-1.5 rounded-lg border border-blue-100">
                <svg
                  className="w-4 h-4 mr-2 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                القسم:{" "}
                <span className="font-medium text-blue-900">
                  {subject.departmentName}
                </span>
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-4 text-sm bg-gray-50 px-3 py-2 rounded-lg">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="text-gray-700">كود المادة:</span>
              <span className="font-mono font-bold text-purple-800 bg-purple-50 px-2 py-1 rounded mx-2">
                {subject.code}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <Link href={`/doctor/${subject.id}`}>
                <button className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white py-2 px-5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center shadow-md hover:shadow-lg">
                  عرض الحضور
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </Link>

              <span className="text-xs text-gray-400">
                آخر تحديث: {new Date().toLocaleDateString("ar-EG")}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className=" border-t border-white/10">
              
            <button
                onClick={handleLogout}>
                <Link
                    href="/auth/signin"
                    className={`flex items-center rounded-lg hover:bg-white/10 transition-all duration-200 
                    }`}
                    title={"تسجيل الخروج" }
                  >
                    
                    <span className="pl-2">
                      <FaSignOutAlt className="text-lg text-red-500" />
                    </span>
                    { <span className="font-medium  text-red-500 ">تسجيل الخروج</span>}
                  </Link>
              </button>
            </div>
    </div>
  );
};

function InfoItem({ label, value }) {
  return (
    <div className="flex items-start">
      <span className="font-medium text-blue-600 min-w-[120px]">{label}:</span>
      <span className="text-gray-700 flex-1">{value}</span>
    </div>
  );
}

export default DoctorP;
