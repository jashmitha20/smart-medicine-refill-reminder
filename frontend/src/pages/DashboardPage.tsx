import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService.ts';
import medicineService from '../services/medicineService.ts';
import { DashboardSummary, Medicine, MedicineStatus, Reminder } from '../types/index.ts';
import notificationService from '../services/notificationService.ts';
import ReminderForm from '../components/ReminderForm.tsx';
import AddMedicineForm from '../components/AddMedicineForm.tsx';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showReminderFor, setShowReminderFor] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [sum, meds] = await Promise.all([
        medicineService.getDashboardSummary(),
        medicineService.getAllMedicines(),
      ]);
      setSummary(sum);
      setMedicines(meds);
    } catch (e: any) {
      setErr(e?.error || e?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Initialize notifications scheduling for stored reminders
  useEffect(() => {
    notificationService.init(medicines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines.length]);

  const logout = async () => {
    await authService.logout();
    navigate('/login', { replace: true });
  };

  const takeDose = async (id: number) => {
    try {
      await medicineService.takeDose(id);
      await load();
    } catch (e: any) {
      alert(e?.error || 'Failed to take dose');
    }
  };

  const refill = async (id: number, qty: number) => {
    try {
      await medicineService.refillMedicine(id, qty);
      await load();
    } catch (e: any) {
      alert(e?.error || 'Failed to refill');
    }
  };

  const deleteMed = async (id: number) => {
    try {
      const ok = window.confirm('Delete this medicine?');
      if (!ok) return;
      await medicineService.deleteMedicine(id);
      await load();
    } catch (e: any) {
      alert(e?.error || 'Failed to delete');
    }
  };

  const color = (s: MedicineStatus) => medicineService.getStatusColor(s);
  const text = (s: MedicineStatus) => medicineService.getStatusText(s);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {loading && <p>Loading...</p>}
      {err && (
        <div className="error" role="alert">
          {err}
        </div>
      )}

      {summary && (
        <section className="summary" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div>All: {summary.totalMedicines}</div>
          <div>Refill: {summary.refillNeeded}</div>
          <div>Low: {summary.lowStock}</div>
          <div>OK: {summary.ok}</div>
        </section>
      )}

      <section>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowReminderFor(-1)}>Add medicine</button>
        </div>
        {showReminderFor === -1 && (
          <div style={{ marginBottom: 12 }}>
            <AddMedicineForm onCreated={() => { load(); setShowReminderFor(null); }} />
          </div>
        )}
        {medicines.map((m) => (
          <div
            key={m.id}
            className="card"
            style={{ borderLeft: `4px solid ${color(m.status)}`, padding: 12, marginBottom: 10 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{m.medicineName}</strong>
              <span title={text(m.status)}>{text(m.status)}</span>
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>
              Doses/day: {m.dosagePerDay} • Qty: {m.currentQuantity}/{m.totalQuantity} • Days left:{' '}
              {medicineService.formatDaysLeft(m.daysLeft)}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => takeDose(m.id)}>Take dose</button>
              <button onClick={() => refill(m.id, m.lowStockThreshold || 10)}>Refill +{m.lowStockThreshold || 10}</button>
              <a
                href={`${process.env.REACT_APP_PHARMACY_URL || 'https://www.1mg.com/search/all?name='}${encodeURIComponent(
                  m.medicineName
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Buy
              </a>
              <button onClick={() => setShowReminderFor(showReminderFor === m.id ? null : m.id)}>
                {showReminderFor === m.id ? 'Close reminder' : 'Set reminder'}
              </button>
              <button onClick={() => deleteMed(m.id)} style={{ background: '#eee', color: '#333' }}>
                Delete
              </button>
            </div>

            {showReminderFor === m.id && (
              <div style={{ marginTop: 8 }}>
                <ReminderForm medicineId={m.id} onCreated={() => setShowReminderFor(null)} />
              </div>
            )}

            {/* Existing reminders list */}
            <div style={{ marginTop: 8 }}>
              {notificationService.listByMedicine(m.id).map((r: Reminder) => (
                <div key={r.id} style={{ fontSize: 12, color: '#444', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span>⏰ {r.time}{r.label ? ` — ${r.label}` : ''}</span>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <input
                      type="checkbox"
                      checked={r.enabled !== false}
                      onChange={(e) => notificationService.setEnabled(r.id, e.target.checked)}
                    />
                    Enabled
                  </label>
                  <button onClick={() => notificationService.remove(r.id)} style={{ background: '#eee', color: '#333' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!loading && medicines.length === 0 && (
          <div>
            <p>No medicines found. Add your first medicine:</p>
            <AddMedicineForm onCreated={() => { load(); setShowReminderFor(null); }} />
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
