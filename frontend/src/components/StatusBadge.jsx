import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  const map = {
    POTENTIALLY_ELIGIBLE: { cls: 'bg-green-100 text-green-700', icon: CheckCircle2, label: t('common.potentiallyEligible') },
    NEEDS_MORE_INFORMATION: { cls: 'bg-amber-100 text-amber-700', icon: AlertCircle, label: t('common.needsMoreInfo') },
    NOT_MATCHED: { cls: 'bg-slate-100 text-slate-500', icon: XCircle, label: t('common.notMatched') },
  };
  const cfg = map[status] || map.NOT_MATCHED;
  const Icon = cfg.icon;
  return (
    <span className={`badge ${cfg.cls}`}>
      <Icon size={13} /> {cfg.label}
    </span>
  );
}
