"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    samester: 1,
    doctorId: 1,
    departmentId: 1,
    levelId: 1,
  });

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("User"))?.tokens;
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          "https://mtisattendence.runasp.net/api/Subjects/GetAll",
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
        setSubjects(result);
        setFilteredSubjects(result);
      } catch (err) {
        console.error("خطأ:", err);
        setError("حصلت مشكلة أثناء تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(value) ||
        subject.code.toLowerCase().includes(value)
    );
    setFilteredSubjects(filtered);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذه المادة؟");
    if (!confirmDelete) return;

    const token = JSON.parse(localStorage.getItem("User"))?.tokens;

    try {
      const response = await fetch(
        ` https://mtisattendence.runasp.net/api/Subjects/Delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("فشل في حذف المادة");
      }

      setSubjects((prev) => prev.filter((subject) => subject.id !== id));
      setFilteredSubjects((prev) =>
        prev.filter((subject) => subject.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("User"))?.tokens;

    const updatedSubject = {
      name: e.target.name.value,
      code: e.target.code.value,
      samester: parseInt(e.target.samester.value),
      doctorId: parseInt(e.target.doctorId.value),
      departmentId: parseInt(e.target.departmentId.value),
      levelId: parseInt(e.target.levelId.value),
    };

    try {
      const response = await fetch(
        `https://mtisattendence.runasp.net/api/Subjects/Update/${currentSubject.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSubject),
        }
      );

      if (!response.ok) {
        throw new Error("فشل في تحديث المادة");
      }

      if (response.status === 204) {
        setSubjects((prev) =>
          prev.map((subject) =>
            subject.id === currentSubject.id
              ? { ...subject, ...updatedSubject }
              : subject
          )
        );
        setFilteredSubjects((prev) =>
          prev.map((subject) =>
            subject.id === currentSubject.id
              ? { ...subject, ...updatedSubject }
              : subject
          )
        );
        setIsEditing(false);
      } else {
        const result = await response.json();
        setSubjects((prev) =>
          prev.map((subject) =>
            subject.id === result.id ? { ...subject, ...result } : subject
          )
        );
        setFilteredSubjects((prev) =>
          prev.map((subject) =>
            subject.id === result.id ? { ...subject, ...result } : subject
          )
        );
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التحديث.");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("User"))?.tokens;

    try {
      const response = await fetch(
        "https://mtisattendence.runasp.net/api/Subjects/Create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubject),
        }
      );

      if (!response.ok) {
        throw new Error("فشل في إضافة المادة");
      }

      if (response.status === 201) {
        const result = await response.json();
        setSubjects((prev) => [...prev, result]);
        setFilteredSubjects((prev) => [...prev, result]);
        setIsAdding(false);
        alert("تم إضافة المادة بنجاح!");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إضافة المادة.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mr-3 text-lg">جارٍ تحميل البيانات...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            نظام إدارة المواد الدراسية
          </h1>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="ابحث باسم المادة أو الكود..."
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Add Subject Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            إضافة مادة جديدة
          </button>
        </div>

        {/* Subjects List */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              لا توجد مواد متاحة
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              لم يتم العثور على مواد مطابقة لبحثك
            </p>
          </div>
        ) : (
          <div className="grid max-h-[550px] overflow-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Header with subject name and code */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{subject.name}</h3>
                    <span className="bg-white text-blue-600 text-xs font-mono font-bold px-2 py-1 rounded-md">
                      {subject.code}
                    </span>
                  </div>
                </div>

                {/* Subject details */}
                <div className="p-5">
                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Level */}
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div className="mx-2">
                        <p className="text-xs text-gray-500 mb-1">المستوى</p>
                        <p className="font-medium text-sm">
                          {subject.levelName}
                        </p>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div className="mx-2">
                        <p className="text-xs text-gray-500 mb-1">القسم</p>
                        <p className="font-medium text-sm">
                          {subject.departmentName}
                        </p>
                      </div>
                    </div>

                    {/* Semester */}
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="mx-2">
                        <p className="text-xs text-gray-500 mb-1">الفصل</p>
                        <p className="font-medium text-sm">
                          الفصل {subject.samester}
                        </p>
                      </div>
                    </div>

                    {/* Doctor */}
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-2 rounded-lg mr-3">
                        <svg
                          className="w-4 h-4 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="mx-2">
                        <p className="text-xs text-gray-500 mb-1">المحاضر</p>
                        <p className="font-medium text-sm">
                          {subject.doctorName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons with improved icons */}
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <Link
                      href={`/dashboard/subjects/${subject.id}`}
                      className="flex-1 mr-2"
                    >
                      <button className="w-full flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm transition-colors">
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        الحضور
                      </button>
                    </Link>

                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentSubject(subject);
                      }}
                      className="flex-1 mx-2 flex items-center justify-center bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      تعديل
                    </button>

                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="flex-1 ml-2 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Subject Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    إضافة مادة جديدة
                  </h3>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleAddSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        اسم المادة
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newSubject.name}
                        onChange={handleChange}
                        placeholder="أدخل اسم المادة"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        كود المادة
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={newSubject.code}
                        onChange={handleChange}
                        placeholder="أدخل كود المادة"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الفصل الدراسي
                        </label>
                        <input
                          type="number"
                          name="samester"
                          value={newSubject.samester}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID المعلم
                        </label>
                        <input
                          type="number"
                          name="doctorId"
                          value={newSubject.doctorId}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID القسم
                        </label>
                        <input
                          type="number"
                          name="departmentId"
                          value={newSubject.departmentId}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID المستوى
                        </label>
                        <input
                          type="number"
                          name="levelId"
                          value={newSubject.levelId}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      إضافة
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Subject Modal */}
        {isEditing && currentSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    تعديل المادة
                  </h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        اسم المادة
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={currentSubject.name}
                        placeholder="أدخل اسم المادة"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        كود المادة
                      </label>
                      <input
                        type="text"
                        name="code"
                        defaultValue={currentSubject.code}
                        placeholder="أدخل كود المادة"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الفصل الدراسي
                        </label>
                        <input
                          type="number"
                          name="samester"
                          defaultValue={currentSubject.samester}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID المعلم
                        </label>
                        <input
                          type="number"
                          name="doctorId"
                          defaultValue={currentSubject.doctorId}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID القسم
                        </label>
                        <input
                          type="number"
                          name="departmentId"
                          defaultValue={currentSubject.departmentId}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID المستوى
                        </label>
                        <input
                          type="number"
                          name="levelId"
                          defaultValue={currentSubject.levelId}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      حفظ التغييرات
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
