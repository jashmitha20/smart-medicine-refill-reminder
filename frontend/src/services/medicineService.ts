import apiService from './api.ts';
import { Medicine, MedicineRequest, MedicineStatus, DashboardSummary } from '../types/index.ts';

class MedicineService {
  async getAllMedicines(): Promise<Medicine[]> {
    return await apiService.get<Medicine[]>('/medicines');
  }

  async getMedicineById(id: number): Promise<Medicine> {
    return await apiService.get<Medicine>(`/medicines/${id}`);
  }

  async createMedicine(medicine: MedicineRequest): Promise<Medicine> {
    return await apiService.post<Medicine>('/medicines', medicine);
  }

  async updateMedicine(id: number, medicine: MedicineRequest): Promise<Medicine> {
    return await apiService.put<Medicine>(`/medicines/${id}`, medicine);
  }

  async deleteMedicine(id: number): Promise<{ message: string }> {
    return await apiService.delete<{ message: string }>(`/medicines/${id}`);
  }

  async takeDose(id: number): Promise<Medicine> {
    return await apiService.post<Medicine>(`/medicines/${id}/take-dose`);
  }

  async refillMedicine(id: number, quantity: number): Promise<Medicine> {
    return await apiService.post<Medicine>(`/medicines/${id}/refill?quantity=${quantity}`);
  }

  async getMedicinesByStatus(status: MedicineStatus): Promise<Medicine[]> {
    return await apiService.get<Medicine[]>(`/medicines/status/${status}`);
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    return await apiService.get<DashboardSummary>('/medicines/dashboard-summary');
  }

  // Utility methods for frontend logic
  getStatusColor(status: MedicineStatus): string {
    switch (status) {
      case MedicineStatus.OK:
        return '#4CAF50';
      case MedicineStatus.LOW:
        return '#FF9800';
      case MedicineStatus.REFILL_NEEDED:
        return '#F44336';
      default:
        return '#757575';
    }
  }

  getStatusText(status: MedicineStatus): string {
    switch (status) {
      case MedicineStatus.OK:
        return 'OK';
      case MedicineStatus.LOW:
        return 'Low Stock';
      case MedicineStatus.REFILL_NEEDED:
        return 'Refill Needed';
      default:
        return 'Unknown';
    }
  }

  formatDaysLeft(daysLeft: number): string {
    if (daysLeft === 0) {
      return 'Today';
    } else if (daysLeft === 1) {
      return '1 day';
    } else if (daysLeft < 0) {
      return 'Overdue';
    } else {
      return `${daysLeft} days`;
    }
  }

  calculateProgress(currentQuantity: number, totalQuantity: number): number {
    if (totalQuantity === 0) return 0;
    return (currentQuantity / totalQuantity) * 100;
  }

  sortMedicinesByPriority(medicines: Medicine[]): Medicine[] {
    return medicines.sort((a, b) => {
      // First sort by status priority (REFILL_NEEDED > LOW > OK)
      const statusPriority = {
        [MedicineStatus.REFILL_NEEDED]: 3,
        [MedicineStatus.LOW]: 2,
        [MedicineStatus.OK]: 1,
      };

      const statusDiff = statusPriority[b.status] - statusPriority[a.status];
      if (statusDiff !== 0) return statusDiff;

      // Then sort by days left (ascending)
      return a.daysLeft - b.daysLeft;
    });
  }
}

export default new MedicineService();