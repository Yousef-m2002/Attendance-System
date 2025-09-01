"use client";

import { useEffect, useState } from "react";
import  Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
const handleLogout = () => {
  localStorage.clear();
};
export default function StudentP() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("User"))?.tokens;

    fetch("https://baseattendence.runasp.net/api/Students/Get", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mr-3 text-gray-600">جاري تحميل البيانات...</p>
      </div>
    );

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

  const { applicationUser, nfc, department, level, attendences } = data;

  return (
    <div
      dir="rtl"
      className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl space-y-8 text-right"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          بيانات الطالب
        </h2>
        <div className="w-20 h-1 mx-auto mt-3 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full"></div>
      </div>

      {/* الصورة الشخصية */}

      {/* User Info */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-blue-100/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoItem
            label="الاسم"
            value={`${applicationUser.firstName || "غير متوفر"} ${
              applicationUser.lastName || ""
            }`}
          />
          <InfoItem
            label="النوع"
            value={applicationUser.sex == "Female" ? "أنثى" : "ذكر"}
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
          {/* <InfoItem label=" البريد الالكتروني " value={applicationUser.userName || "غير متوفر"} /> */}
        </div>
      </div>

      {/* NFC Card */}
      <Section title="بطاقة NFC">
        <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-blue-100/50">
          <InfoItem label="الكود" value={nfc?.code || "غير متوفر"} />
        </div>
      </Section>

      {/* Department & Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="بيانات القسم">
          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-blue-100/50">
            <InfoItem label="القسم" value={department?.name || "غير متوفر"} />
            {/* <InfoItem label="رقم القسم" value={`#${department?.id || "غير متوفر"}`} /> */}
          </div>
        </Section>

        <Section title="المستوى الدراسي">
          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-blue-100/50">
            <InfoItem label="المستوى" value={level?.name || "غير متوفر"} />
            {/* <InfoItem label="رقم المستوى" value={`#${level?.id || "غير متوفر"}`} /> */}
          </div>
        </Section>
      </div>

      {/* الغيابات */}
      <Section title="سجل الغيابات">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المادة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عدد الحضور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عدد الغيابات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendences?.map((attendance, index) => {
                  const totalLectures = 12;
                  const absents = totalLectures - attendance.count;
                  const isTooManyAbsents = absents > 5;

                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {attendance.subjectName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {attendance.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      isTooManyAbsents
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                        >
                          {absents}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {isTooManyAbsents ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-900">
                            محظور
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {attendences?.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              لا توجد سجلات غياب متاحة
            </div>
          )}
        </div>
      </Section>

      <button onClick={handleLogout}>
        <Link
          href="/auth/signin"
          className={`flex items-center rounded-lg hover:bg-white/10 transition-all duration-200 
                    }`}
          title={"تسجيل الخروج"}
        >
          <span className="pl-2">
            <FaSignOutAlt className="text-lg text-red-500" />
          </span>
          {<span className="font-medium  text-red-500 ">تسجيل الخروج</span>}
        </Link>
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-blue-700 border-r-4 border-blue-400 pr-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex items-start">
      <span className="font-medium text-blue-600 min-w-[120px]">{label}:</span>
      <span className="text-gray-700 flex-1">{value}</span>
    </div>
  );
}
