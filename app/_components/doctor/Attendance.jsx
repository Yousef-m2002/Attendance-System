"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'banned', 'active'

  useEffect(() => {
    if (id) {
      fetch(`https://baseattendence.runasp.net/api/Subjects/Get/${id}`)
        .then(response => response.json())
        .then(data => {
          setAttendanceData(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-400 rounded-full mb-4"></div>
          <p className="text-blue-600 font-medium">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl mx-auto my-8 rounded-lg">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-red-800 font-bold">حدث خطأ</h3>
        </div>
        <p className="text-red-700 mt-2">تعذر تحميل البيانات: {error.message}</p>
      </div>
    );
  }

  const { name, levelName, departmentName, doctorName, code } = attendanceData || {};

  // تصفية البيانات حسب البحث وحالة الحظر
  const filteredAttendences = attendanceData?.attendences?.filter(attendance => {
    const matchesSearch = attendance.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const isBanned = (12 - attendance.count) > 5;
    
    if (filter === "banned") return matchesSearch && isBanned;
    if (filter === "active") return matchesSearch && !isBanned;
    return matchesSearch;
  });

  return (
    <div dir="rtl" className="p-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl p-8 mb-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b border-blue-100">
          {name}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-blue-600 mb-1">كود المادة</h3>
            <p className="text-2xl font-bold text-gray-800 font-mono tracking-tight">
              {code}
            </p>
            <div className="mt-2 h-1 w-10 bg-blue-400 rounded-full"></div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-blue-600 mb-1">القسم</h3>
            <p className="text-xl font-medium text-gray-800">
              {departmentName}
            </p>
            <div className="mt-2 h-1 w-10 bg-blue-400 rounded-full"></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-blue-600 mb-1">المستوي</h3>
            <p className="text-xl font-medium text-gray-800">
              {levelName}
            </p>
            <div className="mt-2 h-1 w-10 bg-blue-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* شريط البحث والفلتر */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="ابحث باسم الطالب..."
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg ${filter === "active" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            النشطون
          </button>
          <button
            onClick={() => setFilter("banned")}
            className={`px-4 py-2 rounded-lg ${filter === "banned" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            المحظورون
          </button>
        </div>
      </div>

      {/* جدول الغيابات */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-400">
          <h2 className="text-xl font-bold text-white">سجل الحضور والغياب</h2>
        </div>
        
        {filteredAttendences?.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد نتائج</h3>
            <p className="mt-1 text-gray-500">لم يتم العثور على طلاب مطابقين للبحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-blue-600 uppercase tracking-wider">اسم الطالب</th>
                  {[...Array(12)].map((_, i) => (
                    <th key={i} className="px-3 py-3 text-center text-sm font-medium text-blue-600 uppercase tracking-wider">
                      <span className="inline-block w-6">{i+1}</span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-medium text-blue-600 uppercase tracking-wider">حضور</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-blue-600 uppercase tracking-wider">غياب</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-blue-600 uppercase tracking-wider">حالة</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendences?.map((attendance, index) => {
                  const totalLectures = 12;
                  const presentLectures = attendance.count;
                  const absentLectures = totalLectures - presentLectures;
                  const isBanned = absentLectures > 5;

                  return (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {attendance.studentName}
                        </div>
                      </td>
                      
                      {[...Array(totalLectures)].map((_, i) => {
                        const isPresent = i < presentLectures;
                        return (
                          <td key={i} className="px-1 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {isPresent ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          </td>
                        );
                      })}

                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium text-green-600">
                        {presentLectures}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium text-red-600">
                        {absentLectures}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        {isBanned ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            محظور
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            نشط
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}