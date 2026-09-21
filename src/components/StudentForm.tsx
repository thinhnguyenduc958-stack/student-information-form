import React, { useState } from 'react';
import { MAJORS, StudentRecord } from '../types.ts';
import { User, Calendar, GraduationCap, Send, AlertCircle } from 'lucide-react';

interface StudentFormProps {
  onSubmit: (student: Omit<StudentRecord, 'id' | 'createdAt'>) => void;
  initialValues?: {
    fullName: string;
    birthYear: number | '';
    major: string;
  };
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, initialValues }) => {
  const [fullName, setFullName] = useState(initialValues?.fullName || '');
  const [birthYear, setBirthYear] = useState<string | number>(initialValues?.birthYear ?? '');
  const [major, setMajor] = useState(initialValues?.major || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setError('Vui lòng nhập họ và tên.');
      return;
    }

    const yearNum = Number(birthYear);
    if (!birthYear || isNaN(yearNum) || yearNum < 1900 || yearNum > 2026) {
      setError('Năm sinh không hợp lệ (từ năm 1900 đến 2026).');
      return;
    }

    if (!major) {
      setError('Vui lòng chọn ngành đăng ký.');
      return;
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - yearNum;
    const selectedMajor = MAJORS.find((m) => m.value === major);

    onSubmit({
      fullName: trimmedName,
      birthYear: yearNum,
      major,
      majorName: selectedMajor ? selectedMajor.label : major,
      age: age >= 0 ? age : 0,
    });
  };

  return (
    <form id="student-registration-form" onSubmit={handleSubmit} className="space-y-[18px]">
      {error && (
        <div
          id="form-error-banner"
          className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label
          htmlFor="fullname"
          className="flex items-center gap-1.5 text-sm font-bold text-[#444] mb-2"
        >
          <User className="w-4 h-4 text-[#4285f4]" />
          <span>Họ và tên</span>
        </label>
        <input
          type="text"
          id="fullname"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nhập họ và tên"
          required
          className="w-full px-3.5 py-3 border border-[#ccc] rounded-lg text-[15px] outline-none transition-colors focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/15 bg-white text-gray-800 placeholder:text-gray-400"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="birthyear"
          className="flex items-center gap-1.5 text-sm font-bold text-[#444] mb-2"
        >
          <Calendar className="w-4 h-4 text-[#4285f4]" />
          <span>Năm sinh</span>
        </label>
        <input
          type="number"
          id="birthyear"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          placeholder="Ví dụ: 2007"
          min="1900"
          max="2026"
          required
          className="w-full px-3.5 py-3 border border-[#ccc] rounded-lg text-[15px] outline-none transition-colors focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/15 bg-white text-gray-800 placeholder:text-gray-400"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="major"
          className="flex items-center gap-1.5 text-sm font-bold text-[#444] mb-2"
        >
          <GraduationCap className="w-4 h-4 text-[#4285f4]" />
          <span>Ngành đăng ký</span>
        </label>
        <div className="relative">
          <select
            id="major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            required
            className="w-full px-3.5 py-3 border border-[#ccc] rounded-lg text-[15px] outline-none transition-colors focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/15 bg-white text-gray-800 cursor-pointer appearance-none pr-10"
          >
            <option value="">-- Chọn ngành --</option>
            <option value="cntt">Công nghệ thông tin</option>
            <option value="ai">Trí tuệ nhân tạo</option>
            <option value="ktpm">Kỹ thuật phần mềm</option>
            <option value="attt">An toàn thông tin</option>
            <option value="dpt">Điện tử - Viễn thông</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      <button
        id="btn-submit"
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#4285f4] hover:bg-[#3367d6] text-white font-bold rounded-lg text-base cursor-pointer transition-colors shadow-sm hover:shadow active:scale-[0.99] mt-2.5"
      >
        <Send className="w-4 h-4" />
        <span>Gửi thông tin</span>
      </button>
    </form>
  );
};
