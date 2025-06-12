"use client";

import { useEffect, useState } from "react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSex, setFilterSex] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationalId: "",
    phoneNumber: "",
    sex: "",
    password: "",
  });

  const getToken = () => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('User'));
      return user?.tokens;
    }
    return null;
  };
  const token = getToken();
  const fetchStudents = async () => {
    

 
    if (!token) return;
    try {
      const res = await fetch(
        "https://baseattendence.runasp.net/api/Users/GetAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const makeDoctor = async (userId) => {
    
    const token = getToken();

    if (!token) return;
    try {
      const res = await fetch(
        `https://baseattendence.runasp.net/api/Doctors/Create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            applicationUserId: userId, // ده اللي API عايزه في الـ body
          }),
        }
      );

      if (!res.ok) {
        throw new Error("فشل في تعيين دور الدكتور");
      }

      // إعادة تحميل البيانات بعد التحديث
      fetchStudents();

      // عرض رسالة نجاح بعد الإضافة
      alert("تم تعيين دور الدكتور بنجاح");
    } catch (err) {
      console.error("خطأ في تعيين دور الدكتور:", err);
    }
  };

  const handleDelete = async (email) => {
    const token = getToken();
    if (!token) return;
    try {
      // تأكد من أن الـ email موجود في الطلاب قبل الحذف
      const userToDelete = students.find((student) => student.email === email);
      if (!userToDelete) {
        console.error("المستخدم غير موجود");
        return;
      }

      // إرسال طلب الحذف
      const res = await fetch(
        `https://baseattendence.runasp.net/api/Users/Delete/${email}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("فشل في الحذف");
      }

      // إعادة تحميل البيانات بعد الحذف
      fetchStudents();
    } catch (err) {
      console.error("خطأ في الحذف:", err);
    }
  };

  const handleAdd = async (e) => {
    const token = getToken();
    e.preventDefault();
    const newStudent = {
      ...formData,
      sex: formData.sex === "male" ? "Male" : "Female", // تأكد من إرسال القيمة المقبولة
      roles: ["Doctor"], // جرب Doctor بدل user
    };

    try {
      const res = await fetch(
        "https://baseattendence.runasp.net/api/Users/Add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newStudent),
        }
      );

      const result = await res.json();
      console.log("الرد من API:", result);

      if (!res.ok) {
        throw new Error(result?.message || "فشل في الإضافة");
      }

      fetchStudents();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        nationalId: "",
        phoneNumber: "",
        sex: "",
        password: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("خطأ في الإضافة:", err.message);
    }
  };

  const [studentData, setStudentData] = useState({
    applicationUserId: "",
    departmentId: 1,
    levelId: 1,
  });

  const handleMakeStudent = (doctorUserId) => {
    setShowForm(true); // عرض الفورم لإدخال البيانات
    setStudentData({
      applicationUserId: doctorUserId, // تعيين الـ ID للـ doctor
      departmentId: 1, // قيمة القسم الافتراضية
      levelId: 1, // قيمة المستوى الافتراضية
    });
  };

  // دالة لإرسال البيانات وتحويل الدكتور إلى طالب
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        " https://baseattendence.runasp.net/api/Students/Add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!response.ok) {
        throw new Error("فشل في تحويل المستخدم إلى طالب");
      }

      alert("تم تحويل المستخدم إلى طالب بنجاح");
      setShowForm(false); // إخفاء الفورم بعد الإرسال
      fetchStudents(); // تحديث البيانات
    } catch (err) {
      console.error("خطأ أثناء تحويل المستخدم إلى طالب:", err);
    }
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSex = filterSex
      ? student.sex === (filterSex === "male" ? "Male" : "Female")
      : true;
    const matchesRole = filterRole ? student.roles?.includes(filterRole) : true;
    return matchesSearch && matchesSex && matchesRole;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-blue-800 text-white p-6 rounded-t-lg shadow-md">
          <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
          <p className="text-blue-100">يمكنك إدارة سجلات المستخدمين من هنا</p>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-4 shadow-md rounded-lg mt-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="ابحث بالاسم أو الإيميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow"
            />
            <div className="flex gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">كل الأدوار</option>
                <option value="Doctor">Doctor</option>
                <option value="Admin">Admin</option>
                <option value="Student">Student</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white shadow-md rounded-lg border border-gray-200 mt-4 overflow-hidden">
          <div className="overflow-x-auto h-[600px]">
            <table className="w-full ">
              <thead className="bg-blue-50">
                <tr className="text-right">
                  <th className="p-3 text-blue-800 font-semibold">Id </th>
                  <th className="p-3 text-blue-800 font-semibold">الاسم </th>

                  <th className="p-3 text-blue-800 font-semibold">الإيميل</th>
                  <th className="p-3 text-blue-800 font-semibold">
                    الرقم القومي
                  </th>
                  <th className="p-3 text-blue-800 font-semibold">الهاتف</th>

                  <th className="p-3 text-blue-800 font-semibold">الدور</th>
                  <th className="p-3 text-blue-800 text-center font-semibold">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-gray-700">{student.id}</td>
                    <td className="p-3 text-gray-700">
                      {student.firstName} {student.lastName}
                    </td>

                    <td className="p-3 text-gray-700">{student.email}</td>
                    <td className="p-3 text-gray-700">{student.nationalId}</td>
                    <td className="p-3 text-gray-700">{student.phoneNumber}</td>

                    <td className="p-3 text-gray-700">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {student.roles || "user"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-1 text-nowrap">
                      <button
                        onClick={() => handleDelete(student.email)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        حذف
                      </button>
                      <button
                        onClick={() => makeDoctor(student.id)}
                        className="bg-indigo-100 text-indigo-600 px-1  py-1 rounded-lg hover:bg-indigo-200 transition-colors"
                      >
                        اجعله دكتور
                      </button>
                      <button
                        onClick={() => handleMakeStudent(student.id)}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        اجعله طالب
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Student Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              showAddForm
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            }`}
          >
            {showAddForm ? "إغلاق النموذج" : "إضافة مستخدم جديد"}
          </button>
        </div>

        {/* Add Student Form */}
        {showAddForm && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              نموذج إضافة طالب
            </h3>
            <form
              onSubmit={handleAdd}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-gray-700 mb-1">الاسم الأول</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">الاسم الأخير</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">الإيميل</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">الرقم القومي</label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) =>
                    setFormData({ ...formData, nationalId: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">النوع</label>
                <select
                  value={formData.sex}
                  onChange={(e) =>
                    setFormData({ ...formData, sex: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div className="md:col-span-2 relative">
                <label className="block text-gray-700 mb-1">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
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
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors"
                >
                  حفظ الطالب
                </button>
              </div>
            </form>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 shadow-xl rounded-lg border border-gray-200 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                تحويل المستخدم إلى طالب
              </h3>

              {/* قسم */}
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">القسم</label>
                <input
                  type="number"
                  placeholder="أدخل رقم القسم"
                  value={studentData.departmentId}
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      departmentId: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* مستوى */}
              <div className="mb-6">
                <label className="block mb-2 text-gray-700">المستوى</label>
                <input
                  type="number"
                  placeholder="أدخل رقم المستوى"
                  value={studentData.levelId}
                  onChange={(e) =>
                    setStudentData({ ...studentData, levelId: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* أزرار التحكم */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  تحويل
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
