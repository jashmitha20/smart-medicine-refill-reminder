/* Mock API mode for running frontend without backend */
import { AuthResponse, DashboardSummary, Medicine, MedicineStatus, User } from '../types/index.ts';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// LocalStorage key for per-user medicines
const UM_KEY = 'smrs.userMedicines';

const demoUser: User = {
  id: 1,
  name: 'Demo User',
  email: 'demo@example.com',
};

let token: string | null = null;
let currentUser: User | null = null;
// Load per-user medicine storage (keyed by email) from localStorage
function loadUserMedicines(): Record<string, Medicine[]> {
  try {
    const raw = localStorage.getItem(UM_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Medicine[]>) : {};
  } catch {
    return {};
  }
}

function saveUserMedicines(store: Record<string, Medicine[]>) {
  localStorage.setItem(UM_KEY, JSON.stringify(store));
}

const userMedicines: Record<string, Medicine[]> = loadUserMedicines();

// Seed demo user's medicines if not present
if (!userMedicines[demoUser.email]) {
  userMedicines[demoUser.email] = [
  {
    id: 1,
    medicineName: 'Atorvastatin 10mg',
    dosagePerDay: 1,
    totalQuantity: 30,
    startDate: '2025-10-01',
    refillDate: '2025-10-31',
    currentQuantity: 10,
    notificationsEnabled: true,
    lowStockThreshold: 10,
    status: MedicineStatus.LOW,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    daysLeft: 10,
    remainingDoses: 10,
    refillUrl: 'https://www.1mg.com/search/all?name=Atorvastatin',
  },
  {
    id: 2,
    medicineName: 'Metformin 500mg',
    dosagePerDay: 2,
    totalQuantity: 60,
    startDate: '2025-10-01',
    refillDate: '2025-10-31',
    currentQuantity: 5,
    notificationsEnabled: true,
    lowStockThreshold: 10,
    status: MedicineStatus.REFILL_NEEDED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    daysLeft: 2,
    remainingDoses: 4,
    refillUrl: 'https://www.1mg.com/search/all?name=Metformin',
  },
];
  saveUserMedicines(userMedicines);
}

function getUserKey(): string {
  return (currentUser?.email || demoUser.email).toLowerCase();
}

function getList(): Medicine[] {
  const key = getUserKey();
  if (!userMedicines[key]) userMedicines[key] = [];
  return userMedicines[key];
}

function setList(list: Medicine[]) {
  const key = getUserKey();
  userMedicines[key] = list;
  saveUserMedicines(userMedicines);
}

function computeSummary(): DashboardSummary {
  const list = getList();
  const totalMedicines = list.length;
  const refillNeeded = list.filter((m) => m.status === MedicineStatus.REFILL_NEEDED).length;
  const lowStock = list.filter((m) => m.status === MedicineStatus.LOW).length;
  const ok = list.filter((m) => m.status === MedicineStatus.OK).length;
  return { totalMedicines, refillNeeded, lowStock, ok, recentMedicines: list.slice(0, 5) };
}

export const mockApi = {
  async signin({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
    await delay(600);
    const allowAny = (process.env.REACT_APP_MOCK_LOGIN_ALLOW_ANY || '').toLowerCase() === 'true';
    const demoEmail = process.env.REACT_APP_DEMO_EMAIL || 'demo@example.com';
    const demoPass = process.env.REACT_APP_DEMO_PASSWORD || 'demo1234';

    if (allowAny) {
      if ((email || '').trim() && (password || '').trim()) {
        token = 'mock-token-123';
        currentUser = { id: 2, name: (email || '').split('@')[0] || 'User', email };
        const key = (email || '').toLowerCase();
        if (!userMedicines[key]) {
          userMedicines[key] = [];
          saveUserMedicines(userMedicines);
        }
        return { accessToken: token, tokenType: 'Bearer', user: currentUser };
      }
      throw { error: 'Email and password required' };
    }

    if (email === demoEmail && password === demoPass) {
      token = 'mock-token-123';
      currentUser = demoUser;
      return { accessToken: token, tokenType: 'Bearer', user: demoUser };
    }
    throw { error: 'Invalid credentials' };
  },
  async signup({ name, email, password }: { name: string; email: string; password: string }): Promise<AuthResponse> {
    await delay(600);
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw { error: 'All fields are required' };
    }
    token = 'mock-token-123';
    currentUser = { id: Date.now(), name, email };
    const key = (email || '').toLowerCase();
    if (!userMedicines[key]) {
      userMedicines[key] = [];
      saveUserMedicines(userMedicines);
    }
    return { accessToken: token, tokenType: 'Bearer', user: currentUser };
  },
  async logout(): Promise<void> {
    await delay(200);
    token = null;
    currentUser = null;
  },
  async me(): Promise<User> {
    await delay(200);
    if (!token) throw { error: 'Unauthorized' };
    if (!currentUser) {
      try {
        const raw = localStorage.getItem('user');
        if (raw) currentUser = JSON.parse(raw) as User;
      } catch {}
    }
    return currentUser || demoUser;
  },
  async getMedicines(): Promise<Medicine[]> {
    await delay(300);
    if (!token) throw { error: 'Unauthorized' };
    return getList();
  },
  async getSummary(): Promise<DashboardSummary> {
    await delay(300);
    if (!token) throw { error: 'Unauthorized' };
    return computeSummary();
  },
  async takeDose(id: number): Promise<Medicine> {
    await delay(200);
    const list = getList();
    const m = list.find((x) => x.id === id);
    if (!m) throw { error: 'Not found' };
    if (m.currentQuantity > 0) m.currentQuantity -= 1;
    m.remainingDoses = Math.max(0, m.remainingDoses - 1);
    m.daysLeft = Math.max(0, m.daysLeft - 1);
    m.status = m.currentQuantity === 0 ? MedicineStatus.REFILL_NEEDED : m.currentQuantity <= (m.lowStockThreshold || 10) ? MedicineStatus.LOW : MedicineStatus.OK;
    m.updatedAt = new Date().toISOString();
    setList(list);
    return m;
  },
  async refill(id: number, qty: number): Promise<Medicine> {
    await delay(200);
    const list = getList();
    const m = list.find((x) => x.id === id);
    if (!m) throw { error: 'Not found' };
    m.currentQuantity += qty;
    m.totalQuantity += qty;
    m.remainingDoses += qty;
    m.daysLeft += Math.ceil(qty / m.dosagePerDay);
    m.status = m.currentQuantity <= (m.lowStockThreshold || 10) ? MedicineStatus.LOW : MedicineStatus.OK;
    m.updatedAt = new Date().toISOString();
    setList(list);
    return m;
  },
  async createMedicine(input: Partial<Medicine>): Promise<Medicine> {
    await delay(300);
    const list = getList();
    const id = list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
    const now = new Date();
    const startDate = input.startDate || now.toISOString().slice(0,10);
    const dosagePerDay = Number(input.dosagePerDay || 1);
    const totalQuantity = Number(input.totalQuantity || 0);
    const currentQuantity = Number(input.currentQuantity ?? totalQuantity);
    const daysLeft = dosagePerDay > 0 ? Math.ceil(currentQuantity / dosagePerDay) : 0;
    const status = currentQuantity === 0 ? MedicineStatus.REFILL_NEEDED : currentQuantity <= Number(input.lowStockThreshold || 10) ? MedicineStatus.LOW : MedicineStatus.OK;
    const med: Medicine = {
      id,
      medicineName: String(input.medicineName || 'Unnamed'),
      dosagePerDay,
      totalQuantity,
      startDate,
      refillDate: startDate,
      currentQuantity,
      notificationsEnabled: Boolean(input.notificationsEnabled ?? true),
      lowStockThreshold: Number(input.lowStockThreshold || 10),
      status,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      daysLeft,
      remainingDoses: currentQuantity,
      refillUrl: (process.env.REACT_APP_PHARMACY_URL || 'https://www.1mg.com/search/all?name=') + encodeURIComponent(String(input.medicineName || '')),
    };
    list.push(med);
    setList(list);
    return med;
  },
  async updateMedicine(id: number, input: Partial<Medicine>): Promise<Medicine> {
    await delay(300);
    const list = getList();
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) throw { error: 'Not found' };
    const prev = list[idx];
    const next: Medicine = {
      ...prev,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    // Recompute status and days
    const dosage = Number(next.dosagePerDay || 1);
    const qty = Number(next.currentQuantity || 0);
    next.daysLeft = dosage > 0 ? Math.ceil(qty / dosage) : prev.daysLeft;
    next.status = qty === 0 ? MedicineStatus.REFILL_NEEDED : qty <= Number(next.lowStockThreshold || 10) ? MedicineStatus.LOW : MedicineStatus.OK;
    list[idx] = next;
    setList(list);
    return next;
  },
  async deleteMedicine(id: number): Promise<{ message: string }> {
    await delay(200);
    const list = getList();
    const next = list.filter(x => x.id !== id);
    setList(next);
    return { message: 'Deleted' };
  },
};
