import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Calculator, MapPinned, ShieldCheck, Languages, ScrollText, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <Sparkles size={14} /> Smart India Hackathon · SIH26092 Prototype
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight max-w-3xl mx-auto">{t('tagline')}</h1>
          <p className="mt-5 text-brand-100 max-w-2xl mx-auto text-base sm:text-lg">{t('landing.heroSubtitle')}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={user ? '/onboarding' : '/register'} className="btn-primary bg-saffron hover:bg-orange-500 !px-6 !py-3 text-base">
              {t('landing.ctaPrimary')} <ArrowRight size={18} />
            </Link>
            <Link to="/schemes" className="btn-secondary !bg-white/10 !border-white/40 !text-white hover:!bg-white/20 !px-6 !py-3 text-base">
              {t('landing.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          <FeatureCard icon={<Sparkles className="text-brand-600" />} title={t('landing.featureMatchingTitle')} desc={t('landing.featureMatchingDesc')} />
          <FeatureCard icon={<Calculator className="text-brand-600" />} title={t('landing.featurePlanningTitle')} desc={t('landing.featurePlanningDesc')} />
          <FeatureCard icon={<MapPinned className="text-brand-600" />} title={t('landing.featurePartnersTitle')} desc={t('landing.featurePartnersDesc')} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-indiaGreen" /> {t('landing.trustSource')}</span>
          <span className="flex items-center gap-2"><Languages size={16} className="text-indiaGreen" /> {t('landing.trustMultilingual')}</span>
          <span className="flex items-center gap-2"><ScrollText size={16} className="text-indiaGreen" /> {t('landing.trustTransparent')}</span>
        </div>
      </section>

      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Schemes covered in this prototype</h2>
          <p className="text-sm text-slate-500 mb-6">NSFDC schemes are the primary focus. PMMY and Stand-Up India are additional government financing schemes and are not NSFDC schemes.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {['NSFDC Micro Finance Scheme', 'NSFDC Aajeevika Micro-Finance Yojana', 'NSFDC Term Loan', 'NSFDC Udyam Nidhi Yojana', 'NSFDC Educational Loan Scheme', 'Pradhan Mantri MUDRA Yojana', 'Stand-Up India'].map((s) => (
              <div key={s} className="card p-3 text-slate-600">{s}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card p-6">
      <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );
}
