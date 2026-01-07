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
