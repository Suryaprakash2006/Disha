import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-500">
        <p className="font-medium text-slate-700 mb-1">{t('appName')} — SIH26092 Prototype</p>
        <p>{t('common.prototypeNotice')}</p>
        <p className="mt-2">
          Official sources: NSFDC (nsfdc.nic.in) · Department of Financial Services (financialservices.gov.in) · myScheme (myscheme.gov.in)
        </p>
      </div>
    </footer>
  );
}
