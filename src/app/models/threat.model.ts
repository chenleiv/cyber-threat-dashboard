export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type AttackType = 'Phishing' | 'Malware' | 'DDoS' | 'Brute Force' | 'Ransomware';
export type AlertStatus = 'open' | 'investigating' | 'resolved';

export interface ThreatAlert {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  severity: Severity;
  attackType: AttackType;
  sourceIp: string;
  targetAsset: string;
  status: AlertStatus;
}