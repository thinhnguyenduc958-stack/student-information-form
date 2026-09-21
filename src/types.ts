export interface StudentRecord {
  id: string;
  fullName: string;
  birthYear: number;
  major: string;
  majorName: string;
  age: number;
  createdAt: string;
}

export interface MajorOption {
  value: string;
  label: string;
  code: string;
}

export const MAJORS: MajorOption[] = [
  { value: 'cntt', label: 'Công nghệ thông tin', code: 'CNTT' },
  { value: 'ai', label: 'Trí tuệ nhân tạo', code: 'AI' },
  { value: 'ktpm', label: 'Kỹ thuật phần mềm', code: 'KTPM' },
  { value: 'attt', label: 'An toàn thông tin', code: 'ATTT' },
  { value: 'dpt', label: 'Điện tử - Viễn thông', code: 'ĐTVT' },
];
