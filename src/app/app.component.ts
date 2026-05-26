import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// הגדרת הממשק של הנתונים (Interface)
export interface CyberAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  sourceIp: string;
  targetAsset: string;
  timestamp: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // 1. הסטייט המרכזי של האפליקציה (Signals)
  alerts = signal<CyberAlert[]>([
    {
      id: '1',
      title: 'Potential Phishing Link Clicked',
      description: 'User in HR clicked on a known malicious URL inside an email payload. Outbound connection initiated to suspicious C2 server.',
      severity: 'critical',
      status: 'open',
      sourceIp: '10.0.2.45',
      targetAsset: 'HR-Workstation-04',
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'Spike in Inbound Traffic (DDoS)',
      description: 'Unusual traffic volume targeting public facing web servers. 45,000 requests per second detected from distributed botnet IP ranges.',
      severity: 'medium',
      status: 'investigating',
      sourceIp: '45.22.11.9',
      targetAsset: 'Public-Gateway-LB',
      timestamp: new Date(Date.now() - 15 * 60000) // לפני 15 דקות
    },
    {
      id: '3',
      title: 'Brute Force Attack Detected',
      description: 'Multiple failed SSH login attempts detected from an anomalous external IP targeting root access.',
      severity: 'high',
      status: 'resolved',
      sourceIp: '192.168.1.105',
      targetAsset: 'Production-DB-01',
      timestamp: new Date(Date.now() - 60 * 60000) // לפני שעה
    }
  ]);

  searchTerm = signal<string>('');
  currentSeverityFilter = signal<string>('all');
  
  // ה-Signal החדש שמנהל את הבחירה של המשתמש (Master-Detail)
  selectedAlert = signal<CyberAlert | null>(null);

  // 2. Computed Signals - פילטור הדאטה בזמן אמת (Reactive & Efficient)
  filteredAlerts = computed(() => {
    let list = this.alerts();
    const search = this.searchTerm().toLowerCase();
    const severity = this.currentSeverityFilter();

    // פילטור לפי חומרה
    if (severity !== 'all') {
      list = list.filter(alert => alert.severity === severity);
    }

    // פילטור לפי חיפוש טקסט חופשי (IP, כותרת, נכס)
    if (search) {
      list = list.filter(alert => 
        alert.title.toLowerCase().includes(search) ||
        alert.description.toLowerCase().includes(search) ||
        alert.sourceIp.includes(search) ||
        alert.targetAsset.toLowerCase().includes(search)
      );
    }

    return list;
  });

  // 3. מדדים עליונים מחושבים אוטומטית (Metrics computed dynamic)
  criticalCount = computed(() => {
    return this.alerts().filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  });

  totalOpenCount = computed(() => {
    return this.alerts().filter(a => a.status !== 'resolved').length;
  });

  // 4. מתודות לשינוי מצב (Event Handlers)
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onSeverityChange(severity: string): void {
    this.currentSeverityFilter.set(severity);
  }

  onStatusChange(id: string, currentStatus: string): void {
    let nextStatus: 'open' | 'investigating' | 'resolved' = 'investigating';
    
    if (currentStatus === 'investigating') {
      nextStatus = 'resolved';
    }

    // עדכון הרשימה המרכזית
    this.alerts.update(currentAlerts => 
      currentAlerts.map(alert => 
        alert.id === id ? { ...alert, status: nextStatus } : alert
      )
    );

    // עדכון הסטייט של הפריט הנבחר כדי שהמסך הימני יתעדכן מיידית
    const updatedSelected = this.alerts().find(alert => alert.id === id);
    if (updatedSelected) {
      this.selectedAlert.set(updatedSelected);
    }
  }
}