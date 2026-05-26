import { Component, inject } from '@angular/core';
import { ThreatService } from './services/threat.service';
import { Severity, AlertStatus } from './models/threat.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private threatService = inject(ThreatService);

  public filteredAlerts = this.threatService.filteredAlerts;
  public criticalCount = this.threatService.criticalCount;
  public totalOpenCount = this.threatService.totalOpenCount;

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.threatService.updateSearch(input.value);
  }

  onSeverityChange(severity: Severity | 'all') {
    this.threatService.updateSeverityFilter(severity);
  }

  onStatusChange(id: string, currentStatus: AlertStatus) {
    const nextStatus: AlertStatus = currentStatus === 'open' ? 'investigating' : 'resolved';
    this.threatService.updateAlertStatus(id, nextStatus);
  }
}
