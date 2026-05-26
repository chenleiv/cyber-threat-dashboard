import { Injectable, signal, computed } from '@angular/core';
import { ThreatAlert, Severity, AttackType } from '../models/threat.model';
import { MOCK_ALERTS } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})

export class ThreatService {
  
  // 1. הסטייט המרכזי שלנו (Private Signals)
  // רק הסרביס הזה יכול לשנות את הערכים האלה ישירות באמצעות .set() או .update()
  private alertsSignal = signal<ThreatAlert[]>(MOCK_ALERTS);
  private searchSignal = signal<string>('');
  private severityFilterSignal = signal<Severity | 'all'>('all');
  private typeFilterSignal = signal<AttackType | 'all'>('all');

  // 2. חשיפת פילטרים לקומפוננטות כראייה בלבד (Readonly)
  // זה מונע מקומפוננטות חיצוניות "לחרבש" לנו את הסטייט בטעות
  public searchTerm = this.searchSignal.asReadonly();
  public selectedSeverity = this.severityFilterSignal.asReadonly();
  public selectedType = this.typeFilterSignal.asReadonly();
  

  // 3. הקסם: סיגנל מחושב (Computed) שמסנן את הנתונים באופן אוטומטי ויעיל!
  // בכל פעם שאחד הסיגנלים שבתוך הפונקציה ישתנה, אנגולר יחשב מחדש את התוצאה.
  public filteredAlerts = computed(() => {
    let result = this.alertsSignal();
    const search = this.searchSignal().toLowerCase().trim();
    const severity = this.severityFilterSignal();
    const type = this.typeFilterSignal();

    // סינון לפי דרגת חומרה
    if (severity !== 'all') {
      result = result.filter(alert => alert.severity === severity);
    }

    // סינון לפי סוג מתקפה
    if (type !== 'all') {
      result = result.filter(alert => alert.attackType === type);
    }

    // סינון לפי טקסט חופשי (שם האיום, ה-IP שלו, או שם השרת שנפגע)
    if (search) {
      result = result.filter(alert => 
        alert.title.toLowerCase().includes(search) || 
        alert.sourceIp.includes(search) ||
        alert.targetAsset.toLowerCase().includes(search)
      );
    }

    return result;
  });

  // 4. סטטיסטיקות מחושבות עבור כרטיסי המידע (Metrics) ב-Dashboard
  public criticalCount = computed(() => 
    this.alertsSignal().filter(alert => alert.severity === 'critical' && alert.status !== 'resolved').length
  );
  
  public totalOpenCount = computed(() => 
    this.alertsSignal().filter(alert => alert.status !== 'resolved').length
  );

  // 5. מתודות (פונקציות) לעדכון הסטייט מבחוץ
  updateSearch(term: string) {
    this.searchSignal.set(term);
  }

  updateSeverityFilter(severity: Severity | 'all') {
    this.severityFilterSignal.set(severity);
  }

  updateTypeFilter(type: AttackType | 'all') {
    this.typeFilterSignal.set(type);
  }

  // פונקציה לעדכון סטטוס של איום (למשל כשנרצה לפתור אירוע סייבר)
  updateAlertStatus(id: string, newStatus: 'open' | 'investigating' | 'resolved') {
    this.alertsSignal.update(alerts => 
      alerts.map(alert => alert.id === id ? { ...alert, status: newStatus } : alert)
    );
  }
}