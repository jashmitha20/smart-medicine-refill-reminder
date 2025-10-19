import { Reminder, ReminderInput, Medicine } from '../types/index.ts';

// Simple UUID generator for local usage
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const STORAGE_KEY = 'smrs.reminders';

type Timers = { [id: string]: { timeoutId?: number; intervalId?: number } };
const timers: Timers = {};

function loadAll(): Reminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Reminder[]) : [];
  } catch {
    return [];
  }
}

function saveAll(reminders: Reminder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

function nextTriggerMs(timeHHmm: string, daysOfWeek?: number[]): number {
  const [hh, mm] = timeHHmm.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hh, mm, 0, 0);

  const allowedDays = daysOfWeek && daysOfWeek.length ? new Set(daysOfWeek) : null;

  // If the time today already passed or today not allowed, find next day
  let addDays = 0;
  while (true) {
    const candidate = new Date(target.getTime());
    candidate.setDate(now.getDate() + addDays);
    const dow = candidate.getDay();
    const inWindow = allowedDays ? allowedDays.has(dow) : true;
    const inFuture = candidate.getTime() > now.getTime();
    if (inWindow && inFuture) return candidate.getTime() - now.getTime();
    addDays += 1;
    if (addDays > 7) {
      // Fallback: 24h if something odd happens
      return 24 * 60 * 60 * 1000;
    }
  }
}

async function notify(title: string, body: string) {
  try {
    if (!('Notification' in window)) {
      alert(`${title}: ${body}`);
      return;
    }
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') new Notification(title, { body });
      else alert(`${title}: ${body}`);
    } else {
      alert(`${title}: ${body}`);
    }
  } catch {
    alert(`${title}: ${body}`);
  }
}

function clearTimers(id: string) {
  const t = timers[id];
  if (!t) return;
  if (t.timeoutId) window.clearTimeout(t.timeoutId);
  if (t.intervalId) window.clearInterval(t.intervalId);
  delete timers[id];
}

function scheduleReminder(r: Reminder, medicine?: Medicine) {
  clearTimers(r.id);
  if (r.enabled === false) return;
  const firstWait = nextTriggerMs(r.time, r.daysOfWeek);
  const title = 'Medication Reminder';
  const body = r.label || (medicine ? `Time to take ${medicine.medicineName}` : 'Time to take your medicine');

  const timeoutId = window.setTimeout(() => {
    notify(title, body);
    // Repeat every 24 hours afterwards (respecting daysOfWeek by checking on each tick)
    const intervalId = window.setInterval(() => {
      const today = new Date().getDay();
      if (!r.daysOfWeek || r.daysOfWeek.length === 0 || r.daysOfWeek.includes(today)) {
        notify(title, body);
      }
    }, 24 * 60 * 60 * 1000);
    timers[r.id] = { ...timers[r.id], intervalId };
  }, firstWait);

  timers[r.id] = { timeoutId };
}

function rescheduleAll(medicines?: Medicine[]) {
  const all = loadAll();
  for (const r of all) {
    const med = medicines?.find(m => m.id === r.medicineId);
    scheduleReminder(r, med);
  }
}

const notificationService = {
  init: async (medicines?: Medicine[]) => {
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    } catch {}
    rescheduleAll(medicines);
  },

  listAll: (): Reminder[] => loadAll(),
  listByMedicine: (medicineId: number): Reminder[] => loadAll().filter(r => r.medicineId === medicineId),

  add: (input: ReminderInput): Reminder => {
    const all = loadAll();
    const nowIso = new Date().toISOString();
    const reminder: Reminder = {
      id: uuid(),
      createdAt: nowIso,
      updatedAt: nowIso,
      enabled: input.enabled ?? true,
      label: input.label,
      time: input.time,
      daysOfWeek: input.daysOfWeek,
      medicineId: input.medicineId,
    };
    all.push(reminder);
    saveAll(all);
    scheduleReminder(reminder);
    return reminder;
  },

  remove: (id: string) => {
    const all = loadAll();
    const next = all.filter(r => r.id !== id);
    saveAll(next);
    clearTimers(id);
  },

  setEnabled: (id: string, enabled: boolean) => {
    const all = loadAll();
    const r = all.find(x => x.id === id);
    if (!r) return;
    r.enabled = enabled;
    r.updatedAt = new Date().toISOString();
    saveAll(all);
    if (enabled) scheduleReminder(r); else clearTimers(id);
  },

  rescheduleAll,
};

export default notificationService;
