import React, { useState } from 'react';
import notificationService from '../services/notificationService.ts';

interface Props {
  medicineId: number;
  onCreated?: () => void;
}

const ReminderForm: React.FC<Props> = ({ medicineId, onCreated }) => {
  const [time, setTime] = useState('08:00');
  const [label, setLabel] = useState('');
  const [days, setDays] = useState<number[]>([]);
  const [enabled, setEnabled] = useState(true);

  const toggleDay = (d: number) => {
    setDays(prev => (prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    notificationService.add({ medicineId, time, label: label || undefined, daysOfWeek: days.length ? days : undefined, enabled });
    setLabel('');
    if (onCreated) onCreated();
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <form onSubmit={submit} style={{ marginTop: 8 }}>
      <div className="form-row">
        <label>Time</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Label (optional)</label>
        <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g., After breakfast" />
      </div>
      <div className="form-row">
        <label>Days</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {dayNames.map((name, idx) => (
            <label key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={days.includes(idx)} onChange={() => toggleDay(idx)} />
              {name}
            </label>
          ))}
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ margin: 0 }}>
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Enabled
        </label>
      </div>
      <button type="submit">Save reminder</button>
    </form>
  );
};

export default ReminderForm;
