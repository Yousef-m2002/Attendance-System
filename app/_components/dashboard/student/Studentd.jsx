"use client";
import React, { useState, useEffect } from "react";
const Studntd = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showAddCodeForm, setShowAddCodeForm] = useState(false);
  const [showEditCodeForm, setShowEditCodeForm] = useState(false); // إضافة حالة لعرض فورم التعديل
  const [newCodeData, setNewCodeData] = useState({
    studentId: "",
    code: "",
  });
  const [editData, setEditData] = useState({
    studentId: "",
    code: "",
    image: null,
    nfcId: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://mtisattendence.runasp.net/api/Students/GetAll")
      .then((response) => response.json())
      .then((data) => {
        setStudentsData(data);
        setFilteredData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const filtered = studentsData.filter((student) => {
      const fullName =
        `${student.applicationUser.firstName} ${student.applicationUser.lastName}`.toLowerCase();
      const email = student.applicationUser.email.toLowerCase();
      const nationalId = student.applicationUser.nationalId || "";
      const phone = student.applicationUser.phoneNumber || "";

      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        nationalId.includes(searchTerm) ||
        phone.includes(searchTerm)
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, studentsData]);

  const handleDelete = (doctorId) => {
    fetch(`https://mtisattendence.runasp.net/api/Students/Delete/${doctorId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(() => {
        fetch("https://mtisattendence.runasp.net/api/Students/GetAll")
          .then((response) => response.json())
          .then((data) => {
            setStudentsData(data);
            setFilteredData(data);
          })
          .catch((error) =>
            console.error("Error fetching after delete:", error)
          );
      })
      .catch((error) => console.error("Delete error:", error));
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("يرجى اختيار صورة");
      return;
    }

    const formData = new FormData();
    formData.append("StudentId", newCodeData.studentId);
    formData.append("Code", newCodeData.code);
    formData.append("ImageUrl", selectedImage);

    try {
      setLoading(true);
      const res = await fetch(
        "https://mtisattendence.runasp.net/api/Nfc_Cards/Create",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error(`فشل في الإرسال: ${res.status}`);

      alert("✅ تم الإضافة بنجاح");
      setNewCodeData({ studentId: "", code: "" });
      setSelectedImage(null);
      setShowAddCodeForm(false);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("يرجى اختيار صورة");
      return;
    }

    const formData = new FormData();
    formData.append("StudentId", editData.studentId);
    formData.append("Code", editData.code);
    formData.append("ImageUrl", selectedImage);

    try {
      setLoading(true);
      const res = await fetch(
        `https://mtisattendence.runasp.net/api/Nfc_Cards/Update/${editData.nfcId}`,
        {
          method: "PUT", // استخدام PUT لتحديث البيانات
          body: formData,
        }
      );

      if (!res.ok) throw new Error(`فشل في التعديل: ${res.status}`);

      alert("✅ تم التعديل بنجاح");
      setEditData({ studentId: "", code: "", image: null });
      setSelectedImage(null);
      setShowEditCodeForm(false);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }

    fetch("https://mtisattendence.runasp.net/api/Students/GetAll")
      .then((response) => response.json())
      .then((data) => {
        setStudentsData(data);
        setFilteredData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const openEditForm = (student) => {
    setShowEditCodeForm(true);
    setEditData({
      studentId: student.id,
      code: student.nfc?.code || "",
      image: null,
      nfcId: student.nfc?.id || null,
    });
  };

  return (
    <div dir="rtl" className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-indigo-800 text-white p-6 rounded-t-lg shadow-md">
          <h2 className="text-2xl font-bold">عرض بيانات الطلاب</h2>
          <p className="text-indigo-100">يمكنك إدارة سجلات الطلاب من هنا</p>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg mt-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="ابحث بالاسم، الإيميل، الهاتف أو الهوية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 flex-grow"
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg border max-h-[530px] border-gray-200 mt-4 overflow-hidden">
          <div className="overflow-x-auto h-[550px]">
            <table className="w-full">
              <thead className="bg-indigo-50">
                <tr className="text-right">
                  <th className="p-3 text-indigo-800 font-semibold">Id</th>
                  <th className="p-3 text-indigo-800 font-semibold">
                    اسم الطالب
                  </th>
                  <th className="p-3 text-indigo-800 font-semibold">الإيميل</th>
                  <th className="p-3 text-indigo-800 font-semibold">الهاتف</th>
                  <th className="p-3 text-indigo-800 font-semibold">
                    الهوية الوطنية
                  </th>
                  <th className="p-3 text-indigo-800 font-semibold">الشعبة</th>
                  <th className="p-3 text-indigo-800 font-semibold">المستوى</th>
                  <th className="p-3 text-indigo-800 font-semibold">الكود</th>
                  <th className="p-3 text-indigo-800 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{student.id}</td>
                      <td className="p-3 text-gray-700 font-medium">
                        {student.applicationUser.firstName}{" "}
                        {student.applicationUser.lastName}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student.applicationUser.email}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student.applicationUser.phoneNumber}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student.applicationUser.nationalId}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student.department?.name}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student.level?.name}
                      </td>
                      <td className="p-3 text-gray-700">{student.nfc?.code}</td>
                      <td className="p-3 flex gap-1 ">
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200"
                        >
                          حذف
                        </button>
                        <button
                          onClick={() => openEditForm(student)}
                          className="ml-3 bg-yellow-100 text-yellow-600 px-3 py-1 rounded-lg hover:bg-yellow-200"
                        >
                          تعديل
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      {searchTerm
                        ? "لا توجد نتائج مطابقة للبحث"
                        : "جاري تحميل البيانات..."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* زر إظهار فورم الكود */}
        <div className="mt-4  text-center">
          <button
            onClick={() => setShowAddCodeForm((prev) => !prev)}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            {showAddCodeForm ? "إخفاء فورم الإضافة" : "إضافة كود للطالب"}
          </button>
        </div>

        {/* فورم إضافة كود */}
        {showAddCodeForm && (
          <form
            onSubmit={handleCodeSubmit}
            className="bg-white border  shadow-md p-6 rounded-lg max-w-md mx-auto mt-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-700 text-center">
              إضافة كود للطالب
            </h2>

            <div>
              <label className="block font-semibold">Student ID</label>
              <input
                type="text"
                value={newCodeData.studentId}
                onChange={(e) =>
                  setNewCodeData({ ...newCodeData, studentId: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Code</label>
              <input
                type="text"
                value={newCodeData.code}
                onChange={(e) =>
                  setNewCodeData({ ...newCodeData, code: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">صورة الطالب</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إرسال"}
            </button>
          </form>
        )}

        {/* فورم تعديل الكود */}
        {showEditCodeForm && (
          <form
            onSubmit={handleEditSubmit}
            className="bg-white border  shadow-md p-6 rounded-lg max-w-md mx-auto mt-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-700 text-center">
              تعديل كود الطالب
            </h2>

            <div>
              <label className="block font-semibold">Student ID</label>
              <input
                type="text"
                value={editData.studentId}
                onChange={(e) =>
                  setEditData({ ...editData, studentId: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Code</label>
              <input
                type="text"
                value={editData.code}
                onChange={(e) =>
                  setEditData({ ...editData, code: e.target.value })
                }
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">صورة الطالب</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "جاري التعديل..." : "تعديل"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Studntd;
