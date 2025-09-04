'use client';

import { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCreditCard, FiAward, FiLoader, FiAlertCircle } from 'react-icons/fi';

export default function Profile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('User'))?.tokens;

        const res = await fetch('https://mtisattendence.runasp.net/api/Account/Profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch admin data');

        const data = await res.json();
        setAdmin(data);  // بيانات الأدمن مباشرة من الـ API

      } catch (err) {
        console.error('Error fetching admin:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center text-indigo-600">
          <FiLoader className="animate-spin text-4xl mb-3" />
          <p className="text-lg font-medium">جاري تحميل بيانات الأدمن...</p>
        </div>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center text-red-500">
          <FiAlertCircle className="text-4xl mb-3" />
          <p className="text-lg font-medium">حدث خطأ في جلب البيانات</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto  my-8 px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 text-center relative">
          <div className="absolute top-6 left-6">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <FiAward className="text-white text-xl" />
            </div>
          </div>
          
          
          
          <h1 className="text-3xl font-bold text-white mb-2">{admin.firstName} {admin.lastName}</h1>
          <p className="text-blue-200 text-lg">{admin.email}</p>
        </div>
  
        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          {/* Column 1 */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-5 rounded-xl hover:shadow-md transition">
              <div className="flex items-center mb-3">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <FiUser className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">المعلومات الشخصية</h3>
              </div>
              <div className="space-y-3 pl-16">
                <div>
                  <p className="text-sm text-gray-500">الاسم الأول</p>
                  <p className="font-medium text-gray-800">{admin.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الاسم الأخير</p>
                  <p className="font-medium text-gray-800">{admin.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">النوع</p>
                  <p className="font-medium text-gray-800">
                    {admin.sex === "Male" ? "ذكر" : "أنثى"}
                  </p>
                </div>
              </div>
            </div>
  
            <div className="bg-gray-50 p-5 rounded-xl hover:shadow-md transition">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <FiCreditCard className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">الهوية الوطنية</h3>
              </div>
              <div className="pl-16">
                <p className="font-mono text-xl font-bold text-gray-800 tracking-wider">
                  {admin.nationalId}
                </p>
              </div>
            </div>
          </div>
  
          {/* Column 2 */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-5 rounded-xl hover:shadow-md transition">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <FiPhone className="text-green-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">معلومات الاتصال</h3>
              </div>
              <div className="space-y-3 pl-16">
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <p className="font-medium text-gray-800 break-all">{admin.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف</p>
                  <p className="font-medium text-gray-800">
                    {admin.phoneNumber || 'غير متوفر'}
                  </p>
                </div>
              </div>
            </div>
  
            <div className="bg-gray-50 p-5 rounded-xl hover:shadow-md transition">
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <FiAward className="text-purple-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">الصلاحيات</h3>
              </div>
              <div className="pl-16">
                <div className="flex flex-wrap gap-2">
                  {admin.role?.map((role, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              اسم المستخدم: <span className="font-mono text-gray-700">{admin.userName}</span>
            </div>
            <div className="text-sm text-gray-500">
              آخر تحديث: {new Date().toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
