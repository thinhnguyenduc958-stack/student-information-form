import React from 'react';
import { StudentRecord } from '../types.ts';
import { User, GraduationCap, Calendar, Trash2, ArrowLeft } from 'lucide-react';

interface StudentListProps {
  students: StudentRecord[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onSelect: (student: StudentRecord) => void;
  onClearAll: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onBack,
  onDelete,
  onSelect,
  onClearAll,
}) => {
  return (
    <div id="student-list-view" className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <button
          id="btn-back-to-form"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-[#4285f4] hover:underline font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
        <span className="text-xs font-semibold text-gray-500">
          Tổng cộng: {students.length} sinh viên
        </span>
      </div>

      {students.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-sm">
          Chưa có hồ sơ sinh viên nào được lưu.
        </div>
      ) : (
        <div className="max-h-[360px] overflow-y-auto space-y-2.5 pr-1">
          {students.map((st) => (
            <div
              key={st.id}
              id={`student-item-${st.id}`}
              className="p-3 bg-gray-50 hover:bg-blue-50/40 border border-gray-200 hover:border-blue-200 rounded-lg transition-colors flex items-center justify-between gap-3 group"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onSelect(st)}
                title="Nhấn để xem chi tiết"
              >
                <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                  <User className="w-3.5 h-3.5 text-[#4285f4]" />
                  <span>{st.fullName}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {st.birthYear} ({st.age} tuổi)
                  </span>
                  <span className="flex items-center gap-1 text-[#4285f4] font-medium">
                    <GraduationCap className="w-3 h-3" />
                    {st.majorName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(st.id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                title="Xóa hồ sơ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {students.length > 0 && (
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
          <button
            type="button"
            onClick={onClearAll}
            className="text-red-500 hover:text-red-700 hover:underline cursor-pointer"
          >
            Xóa tất cả
          </button>
          <span className="text-gray-400">Lưu trong trình duyệt</span>
        </div>
      )}
    </div>
  );
};
