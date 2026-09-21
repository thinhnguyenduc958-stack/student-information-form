/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { StudentRecord, AIAdvisoryResult } from './types.ts';
import { StudentForm } from './components/StudentForm.tsx';
import { StudentCard } from './components/StudentCard.tsx';
import { StudentList } from './components/StudentList.tsx';
import { AIStudentForm } from './components/AIStudentForm.tsx';
import { AIResultSection } from './components/AIResultSection.tsx';
import { Users, PlusCircle, Sparkles, UserCheck } from 'lucide-react';

const STORAGE_KEY = 'registered_students';
const AI_RESULT_STORAGE_KEY = 'last_ai_advisory_result';

export default function App() {
  // Main Tab Navigation: 'standard' (Hồ sơ sinh viên gốc) vs 'ai' (AI Student Information)
  const [activeTab, setActiveTab] = useState<'standard' | 'ai'>('ai');

  // Standard Form States
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

  // AI Form States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAdvisoryResult | null>(() => {
    try {
      const saved = localStorage.getItem(AI_RESULT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const formTopRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Sync students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [students]);

  // Sync AI result to localStorage
  useEffect(() => {
    try {
      if (aiResult) {
        localStorage.setItem(AI_RESULT_STORAGE_KEY, JSON.stringify(aiResult));
      } else {
        localStorage.removeItem(AI_RESULT_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save AI result', e);
    }
  }, [aiResult]);

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

  const handleAiSuccess = (result: AIAdvisoryResult) => {
    setAiResult(result);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleScrollToForm = () => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      id="app-root"
      className="min-h-screen bg-[#f2f5f9] flex flex-col justify-center items-center py-8 px-4 sm:px-6 selection:bg-[#4285f4] selection:text-white"
    >
      <div ref={formTopRef} />

      {/* Main Mode Toggle Switcher */}
      <div
        id="mode-tabs"
        className="w-full max-w-[400px] mb-4 p-1 bg-gray-200/80 rounded-xl flex items-center gap-1 shadow-inner text-sm font-semibold"
      >
        <button
          id="tab-ai-form"
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-white text-[#4285f4] shadow-sm font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#4285f4]" />
          <span>AI Student Info</span>
        </button>

        <button
          id="tab-standard-form"
          type="button"
          onClick={() => setActiveTab('standard')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'standard'
              ? 'bg-white text-[#4285f4] shadow-sm font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Hồ sơ cơ bản</span>
        </button>
      </div>

      {/* Main Content Card Container */}
      <div
        id="student-container"
        className={`w-full ${
          activeTab === 'ai' ? 'max-w-[620px]' : 'max-w-[420px]'
        } bg-white p-6 sm:p-[35px] rounded-[15px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all duration-300`}
      >
        {/* ===================== TAB: AI STUDENT INFORMATION ===================== */}
        {activeTab === 'ai' && (
          <div id="ai-tab-content">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <div>
                <h2
                  id="ai-app-title"
                  className="text-[22px] font-bold text-[#222] tracking-tight m-0 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-[#4285f4]" />
                  <span>AI Student Information</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Nhập thông tin chi tiết để nhận phân tích và lộ trình học tập cá nhân hóa từ AI
                </p>
              </div>
            </div>

            {/* AI Input Form */}
            <AIStudentForm
              onSuccess={handleAiSuccess}
              isLoading={isAiLoading}
              setIsLoading={setIsAiLoading}
              existingStudents={students}
            />

            {/* AI Result Section (Appears directly below the form) */}
            {aiResult && (
              <div ref={resultRef}>
                <AIResultSection
                  result={aiResult}
                  onClear={() => setAiResult(null)}
                  onScrollToForm={handleScrollToForm}
                />
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: STANDARD STUDENT FORM ===================== */}
        {activeTab === 'standard' && (
          <div id="standard-tab-content">
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

            {/* Standard Views */}
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
        )}
      </div>

      {/* Footer copyright / info note */}
      <div className="mt-5 text-center text-xs text-gray-400">
        Hệ thống tiếp nhận thông tin sinh viên &bull; Tích hợp Gemini AI &bull; {new Date().getFullYear()}
      </div>
    </div>
  );
}
