"use client";
import React, { useState, useEffect } from "react";

const DoctorsD = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // دالة لجلب البيانات من الـ API
  const fetchData = () => {
    fetch("https://mtisattendence.runasp.net/api/Doctors/GetAll")
      .then((response) => response.json())
      .then((data) => {
        setStudentsData(data);
        setFilteredData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // جلب البيانات عند التحميل لأول مرة
  useEffect(() => {
    fetchData();
  }, []);

  // تصفية البيانات عند تغيير searchTerm
  useEffect(() => {
    const filtered = studentsData.filter((student) => {
      const fullName = `${student.applicationUser.firstName} ${student.applicationUser.lastName}`.toLowerCase();
      const email = student.applicationUser.email.toLowerCase();
      const nationalId = student.applicationUser.nationalId || '';
      const phone = student.applicationUser.phoneNumber || '';
      
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        nationalId.includes(searchTerm) ||
        phone.includes(searchTerm)
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, studentsData]);

  // دالة لحذف الدكتور باستخدام الـ ID
  const handleDelete = async (doctorUserId) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا الدكتور؟")) {
      try {
        const response = await fetch(`https://mtisattendence.runasp.net/api/Doctors/Delete/${doctorUserId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("فشل في حذف الدكتور");
        }

        // إعادة جلب البيانات بعد الحذف
        fetchData();
      } catch (error) {
        console.error("خطأ أثناء حذف الدكتور:", error);
      }
    }
  };

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-indigo-800 text-white p-6 rounded-t-lg shadow-md">
          <h2 className="text-2xl font-bold">عرض بيانات الدكتور</h2>
          <p className="text-indigo-100">يمكنك إدارة سجلات الدكاترة من هنا</p>
        </div>

        {/* Search Card */}
        <div className="bg-white p-4 shadow-md rounded-lg mt-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="ابحث بالاسم، الإيميل، الهاتف أو الهوية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white shadow-md rounded-lg border border-gray-200 mt-4 overflow-hidden">
          <div className="overflow-x-auto h-[550px]">
            <table className="w-full">
              <thead className="bg-indigo-50">
                <tr className="text-right">
                  <th className="p-3 text-indigo-800 font-semibold"> Id</th>
                  <th className="p-3 text-indigo-800 font-semibold">اسم الدكتور</th>
                  <th className="p-3 text-indigo-800 font-semibold">الإيميل</th>
                  <th className="p-3 text-indigo-800 font-semibold">الهاتف</th>
                  <th className="p-3 text-indigo-800 font-semibold">الهوية الوطنية</th>
                  {filteredData.length > 0 &&
                    filteredData[0].subjects?.map((subject, index) => (
                      <th key={index} className="p-3 text-indigo-800 font-semibold">
                        <div>المادة رقم {index + 1}</div>
                      </th>
                    ))}
                  <th className="p-3 text-indigo-800 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-700">{student.id}</td>
                      <td className="p-3 text-gray-700 font-medium">
                        {student.applicationUser.firstName} {student.applicationUser.lastName}
                      </td>
                      <td className="p-3 text-gray-700">{student.applicationUser.email}</td>
                      <td className="p-3 text-gray-700">{student.applicationUser.phoneNumber}</td>
                      <td className="p-3 text-gray-700">{student.applicationUser.nationalId}</td>
                      {student.subjects?.map((subject, subIndex) => (
                        <td key={subIndex} className="p-3 text-gray-700">
                          <div className="font-medium text-indigo-600">{subject.name}</div>
                          <div className="text-xs text-gray-500">
                            {subject.code} | {subject.levelName}
                          </div>
                        </td>
                      ))}
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "جاري تحميل البيانات..."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsD;
