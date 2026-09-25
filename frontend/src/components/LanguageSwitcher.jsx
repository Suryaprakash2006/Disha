import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'te', label: 'తె' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('disha_lang', code);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1 bg-white">
      <Languages size={14} className="text-slate-400 ml-1" />
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => changeLang(l.code)}
          className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${i18n.language === l.code ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
