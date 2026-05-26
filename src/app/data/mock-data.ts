import { ThreatAlert } from '../models/threat.model';

export const MOCK_ALERTS: ThreatAlert[] = [
  {
    id: '1',
    timestamp: new Date(),
    title: 'Suspicious Brute Force Attempt',
    description: 'Multiple failed SSH login attempts detected from an anomalous external IP.',
    severity: 'high',
    attackType: 'Brute Force',
    sourceIp: '192.168.1.150',
    targetAsset: 'Production-Auth-Server',
    status: 'open'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60000), // לפני 15 דקות
    title: 'Potential Phishing Link Clicked',
    description: 'User in HR clicked on a known malicious URL inside an email payload.',
    severity: 'critical',
    attackType: 'Phishing',
    sourceIp: '10.0.2.45',
    targetAsset: 'HR-Workstation-04',
    status: 'investigating'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 60 * 60000), // לפני שעה
    title: 'Spike in Inbound Traffic (DDoS)',
    description: 'Unusual traffic volume targeting public facing web servers.',
    severity: 'medium',
    attackType: 'DDoS',
    sourceIp: '45.22.11.9],',
    targetAsset: 'Public-Gateway-LB',
    status: 'resolved'
  }
];