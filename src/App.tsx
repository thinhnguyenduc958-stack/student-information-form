/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { StudentRecord } from './types.ts';
import { StudentForm } from './components/StudentForm.tsx';
import { StudentCard } from './components/StudentCard.tsx';
import { StudentList } from './components/StudentList.tsx';
import { Users, PlusCircle } from 'lucide-react';

const STORAGE_KEY = 'registered_students';

export default function App() {
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeView, setActiveView] = useState<'form' | 'success' | 'list'>('form');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [editingValues, setEditingValues] = useState<{
    fullName: string;
    birthYear: number | '';
    major: string;
  } | undefined>(undefined);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [students]);

  const handleFormSubmit = (data: Omit<StudentRecord, 'id' | 'createdAt'>) => {
    const newId = `SV${new Date().getFullYear().toString().slice(-2)}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`;

    const newRecord: StudentRecord = {
      ...data,
      id: newId,
      createdAt: formattedTime,
    };

    setStudents((prev) => [newRecord, ...prev]);
    setSelectedStudent(newRecord);
    setEditingValues(undefined);
    setActiveView('success');
  };

  const handleEdit = () => {
    if (selectedStudent) {
      setEditingValues({
        fullName: selectedStudent.fullName,
        birthYear: selectedStudent.birthYear,
        major: selectedStudent.major,
      });
      setActiveView('form');
    }
  };

  const handleResetForm = () => {
    setEditingValues(undefined);
    setSelectedStudent(null);
    setActiveView('form');
  };

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
      setActiveView('form');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách sinh viên?')) {
      setStudents([]);
      setSelectedStudent(null);
      setActiveView('form');
    }
  };

  return (
    <div
      id="app-root"
      className="min-h-screen bg-[#f2f5f9] flex flex-col justify-center items-center p-4 selection:bg-[#4285f4] selection:text-white"
    >
      <div
        id="student-container"
        className="w-full max-w-[400px] bg-white p-[35px] rounded-[15px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all duration-300"
      >
        {/* Top Header / View switcher */}
        <div className="flex items-center justify-between mb-[25px]">
          <h2
            id="app-title"
            className="text-[22px] font-bold text-[#222] tracking-tight m-0"
          >
            {activeView === 'form'
              ? 'Thông tin sinh viên'
              : activeView === 'success'
              ? 'Hồ sơ đã ghi nhận'
              : 'Danh sách sinh viên'}
          </h2>

          {students.length > 0 && activeView === 'form' && (
            <button
              id="btn-toggle-saved-list"
              type="button"
              onClick={() => setActiveView('list')}
              className="inline-flex items-center gap-1 text-xs text-[#4285f4] hover:text-[#3367d6] bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer"
              title="Xem danh sách đã lưu"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Đã lưu ({students.length})</span>
            </button>
          )}

          {activeView === 'list' && (
            <button
              id="btn-new-form-shortcut"
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1 text-xs text-white bg-[#4285f4] hover:bg-[#3367d6] px-2.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nhập mới</span>
            </button>
          )}
        </div>

        {/* Dynamic Views */}
        {activeView === 'form' && (
          <StudentForm
            key={editingValues ? editingValues.fullName : 'new'}
            onSubmit={handleFormSubmit}
            initialValues={editingValues}
          />
        )}

        {activeView === 'success' && selectedStudent && (
          <StudentCard
            student={selectedStudent}
            onReset={handleResetForm}
            onEdit={handleEdit}
            onViewList={() => setActiveView('list')}
            totalSavedCount={students.length}
          />
        )}

        {activeView === 'list' && (
          <StudentList
            students={students}
            onBack={() => setActiveView(selectedStudent ? 'success' : 'form')}
            onDelete={handleDelete}
            onSelect={(student) => {
              setSelectedStudent(student);
              setActiveView('success');
            }}
            onClearAll={handleClearAll}
          />
        )}
      </div>

      {/* Footer copyright / info note */}
      <div className="mt-4 text-center text-xs text-gray-400">
        Hệ thống tiếp nhận thông tin sinh viên &bull; {new Date().getFullYear()}
      </div>
    </div>
  );
}
