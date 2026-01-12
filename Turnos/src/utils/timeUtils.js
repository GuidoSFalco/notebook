import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const generateTimeSlots = (intervalMinutes = 15, startHour = 9, endHour = 19) => {
  const slots = [];
  let currentTime = new Date();
  currentTime.setHours(startHour, 0, 0, 0);
  
  const endTime = new Date();
  endTime.setHours(endHour, 0, 0, 0);

  while (currentTime < endTime) {
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
    
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }

  return slots;
};

export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const formatDateES = (date) => {
    if (!date) return '';
    return format(new Date(date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
};

export const formatTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'HH:mm');
};

export const generateMockOccupancy = (year, month) => {
    const occupancy = {};
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
        const day = i.toString().padStart(2, '0');
        const monthStr = (month + 1).toString().padStart(2, '0');
        const dateStr = `${year}-${monthStr}-${day}`;
        
        const random = Math.random();
        if (random > 0.8) occupancy[dateStr] = 'full';
        else if (random > 0.6) occupancy[dateStr] = 'high';
        else if (random > 0.4) occupancy[dateStr] = 'medium';
        else if (random > 0.2) occupancy[dateStr] = 'low';
    }
    return occupancy;
};
