/**
 * Utility functions for 7-day cycle calculations
 * Cycles reset every Monday 00:00:00 KST / UTC
 */

export function getCurrent7DayCycle(): {
  cycleId: string;
  startDate: Date;
  endDate: Date;
  remainingMs: number;
  formattedRange: string;
} {
  const now = new Date();
  
  // Calculate start of current week (Monday)
  const day = now.getDay(); // 0 is Sunday, 1 is Monday, ...
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);

  // ISO Year & Week number for unique cycleId
  const temp = new Date(monday.getTime());
  temp.setDate(temp.getDate() + 3); // target Thursday
  const firstThursday = temp.getTime();
  temp.setMonth(0, 1);
  if (temp.getDay() !== 4) {
    temp.setMonth(0, 1 + ((4 - temp.getDay() + 7) % 7));
  }
  const weekNum = 1 + Math.ceil((firstThursday - temp.getTime()) / 604800000);
  const cycleId = `${monday.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;

  const remainingMs = Math.max(0, nextMonday.getTime() - now.getTime());

  const formatM = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  const endDisplayDate = new Date(nextMonday);
  endDisplayDate.setDate(endDisplayDate.getDate() - 1);
  const formattedRange = `${formatM(monday)} ~ ${formatM(endDisplayDate)}`;

  return {
    cycleId,
    startDate: monday,
    endDate: nextMonday,
    remainingMs,
    formattedRange,
  };
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '초기화 진행 중';
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}일 ${hours}시간 남음`;
  }
  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }
  return `${minutes}분 남음`;
}
