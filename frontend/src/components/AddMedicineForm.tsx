import React, { useState } from 'react';
import { MedicineRequest } from '../types/index.ts';
import medicineService from '../services/medicineService.ts';

interface Props {
  onCreated?: () => void;
}

const AddMedicineForm: React.FC<Props> = ({ onCreated }) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosagePerDay, setDosagePerDay] = useState<number>(1);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [currentQuantity, setCurrentQuantity] = useState<number | undefined>(undefined);
  const [lowStockThreshold, setLowStockThreshold] = useState<number | undefined>(10);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Client-side validation to match backend (must be > 0)
    if (!medicineName.trim()) {
      setError('Please enter a medicine name');
      return;
    }
    if (Number(dosagePerDay) < 1) {
      setError('Dosage per day must be at least 1');
      return;
    }
    if (Number(totalQuantity) < 1) {
      setError('Total quantity must be at least 1');
      return;
    }

    setSubmitting(true);
    try {
      const payload: MedicineRequest = {
        medicineName,
        dosagePerDay: Number(dosagePerDay),
        totalQuantity: Number(totalQuantity),
        startDate,
        ...(currentQuantity !== undefined ? { currentQuantity: Number(currentQuantity) } : {}),
        ...(notificationsEnabled !== undefined ? { notificationsEnabled } : {}),
        ...(lowStockThreshold !== undefined ? { lowStockThreshold: Number(lowStockThreshold) } : {}),
      };
      await medicineService.createMedicine(payload);
      setMedicineName('');
      setDosagePerDay(1);
      setTotalQuantity(1);
      setStartDate(new Date().toISOString().slice(0,10));
      setCurrentQuantity(undefined);
      setLowStockThreshold(10);
      setNotificationsEnabled(true);
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err?.error || err?.message || 'Failed to add medicine');
      console.error('Add medicine error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card" style={{ padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Add Medicine</h3>
      <div className="form-row">
        <label>Medicine name</label>
        <input type="text" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} required placeholder="e.g., Metformin 500mg" />
      </div>
      <div className="form-row">
        <label>Dosage per day</label>
        <input type="number" min={1} value={dosagePerDay} onChange={(e) => setDosagePerDay(Number(e.target.value))} required />
      </div>
      <div className="form-row">
        <label>Total quantity</label>
        <input type="number" min={1} value={totalQuantity} onChange={(e) => setTotalQuantity(Number(e.target.value))} required />
      </div>
      <div className="form-row">
        <label>Start date</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Current quantity (optional)</label>
        <input type="number" min={0} value={currentQuantity ?? ''} onChange={(e) => setCurrentQuantity(e.target.value === '' ? undefined : Number(e.target.value))} />
      </div>
      <div className="form-row">
        <label>Low stock threshold (optional)</label>
        <input type="number" min={0} value={lowStockThreshold ?? ''} onChange={(e) => setLowStockThreshold(e.target.value === '' ? undefined : Number(e.target.value))} />
      </div>
      <div className="form-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ margin: 0 }}>
          <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} /> Enable notifications
        </label>
      </div>
      {error && <div className="error" role="alert">{error}</div>}
      <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add medicine'}</button>
    </form>
  );
};

export default AddMedicineForm;
