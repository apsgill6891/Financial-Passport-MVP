import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Copy,
  CreditCard,
  Globe,
  Home,
  Loader2,
  Lock,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

type ConsentKey =
  | 'GFHS Letter Grade'
  | '60-Month Rent History'
  | 'Income Band'
  | 'Exact Income Figure'
  | 'Credit Score'
  | 'Employment Status'
  | 'Tax Return Verification'
  | 'Net Worth';

const initialConsent: Record<ConsentKey, boolean> = {
  'GFHS Letter Grade': true,
  '60-Month Rent History': true,
  'Income Band': true,
  'Exact Income Figure': false,
  'Credit Score': false,
  'Employment Status': true,
  'Tax Return Verification': false,
  'Net Worth': false
};

const pageMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4 }
};

const card = 'rounded-2xl bg-white p-6 shadow-sm';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen">
    <div className="fixed left-0 right-0 top-0 z-30 bg-teal px-4 py-2 text-center text-sm font-medium text-navy">
      🎯 Demo Mode · Pilot: Canada → United States · Apartment Rental Use Case
    </div>
    <main className="pt-12">{children}</main>
  </div>
);

const TransitionPage = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div className={className} {...pageMotion}>
    {children}
  </motion.div>
);

const ConsumerSteps = ({ step }: { step: number }) => {
  const labels = ['Build', 'Score', 'Consent', 'Share'];
  return (
    <div className="mb-8 flex items-center gap-5">
      {labels.map((label, index) => {
        const n = index + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${done ? 'bg-success' : active ? 'h-3 w-8 rounded-full bg-teal' : 'bg-slate-300'}`}
            />
            <span className={`text-sm ${active ? 'text-navy font-semibold' : 'text-slate'}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const [verified, setVerified] = useState({ credit: false, income: false, rent: false });
  const [loading, setLoading] = useState<string | null>(null);
  const [consent, setConsent] = useState(initialConsent);
  const [showModal, setShowModal] = useState(false);

  const connect = (key: 'credit' | 'income' | 'rent') => {
    setLoading(key);
    setTimeout(() => {
      setVerified((v) => ({ ...v, [key]: true }));
      setLoading(null);
    }, 1500);
  };

  const allVerified = useMemo(() => Object.values(verified).every(Boolean), [verified]);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route
            path="/consumer/build"
            element={<PassportBuilder verified={verified} loading={loading} connect={connect} allVerified={allVerified} />}
          />
          <Route path="/consumer/score" element={<ScoreReveal />} />
          <Route path="/consumer/consent" element={<ConsentDashboard consent={consent} setConsent={setConsent} />} />
          <Route path="/consumer/ready" element={<PassportReady />} />
          <Route path="/landlord" element={<LandlordLogin />} />
          <Route
            path="/landlord/application"
            element={<ApplicationView showModal={showModal} setShowModal={setShowModal} />}
          />
          <Route path="/landlord/decision" element={<DecisionScreen />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

const Landing = () => (
  <TransitionPage className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center bg-navy p-8 text-white">
    <div className="mb-4 flex items-center gap-3 text-4xl font-heading">
      <Globe className="text-teal" size={36} /> Financial <span className="text-teal">Passport</span>
    </div>
    <p className="mb-10 text-lg text-slate-300">Your financial identity, portable and yours.</p>
    <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
      <div className={`${card} text-slate-900`}>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-teal/15">
          <Shield className="text-teal" />
        </div>
        <h2 className="font-heading text-2xl">I&apos;m a Newcomer</h2>
        <p className="mb-6 mt-2 text-slate">Build your verified profile for cross-border renting confidence.</p>
        <Link className="inline-flex items-center rounded-xl bg-teal px-5 py-3 font-medium text-white" to="/consumer/build">
          Create My Passport
        </Link>
      </div>
      <div className={`${card} text-slate-900`}>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
          <Building2 className="text-gold" />
        </div>
        <h2 className="font-heading text-2xl">I&apos;m a Landlord</h2>
        <p className="mb-6 mt-2 text-slate">Review verified applicant intelligence quickly and confidently.</p>
        <Link className="inline-flex items-center rounded-xl border border-gold px-5 py-3 font-medium text-gold" to="/landlord">
          View Application
        </Link>
      </div>
    </div>
    <p className="mt-8 text-sm text-slate-300">Equifax CA verified · Plaid connected · CRA verified · PIPEDA compliant</p>
  </TransitionPage>
);

const PassportBuilder = ({
  verified,
  loading,
  connect,
  allVerified
}: {
  verified: Record<'credit' | 'income' | 'rent', boolean>;
  loading: string | null;
  connect: (k: 'credit' | 'income' | 'rent') => void;
  allVerified: boolean;
}) => (
  <TransitionPage className="mx-auto max-w-5xl p-8">
    <ConsumerSteps step={1} />
    <h1 className="mb-6 font-heading text-4xl text-navy">Let&apos;s build your Financial Passport</h1>
    <div className="space-y-4">
      <SourceCard icon={CreditCard} title="Foreign Credit Score" source="Equifax Canada · TransUnion" data="Score: 748 · History: 8 years · Accounts: 6 active" done={verified.credit} loading={loading === 'credit'} onClick={() => connect('credit')} />
      <SourceCard icon={Briefcase} title="Income & Employment" source="CRA" data="Annual income: $87,400 · Employment: Full-time · Tax returns: 3 years verified" done={verified.income} loading={loading === 'income'} onClick={() => connect('income')} />
      <SourceCard icon={Home} title="Rental History" source="Plaid · Property API" data="60-month history · 0 missed payments · Last rent: $2,100/mo" done={verified.rent} loading={loading === 'rent'} onClick={() => connect('rent')} />
    </div>
    {allVerified && (
      <Link className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal px-6 py-3 font-medium text-white" to="/consumer/score">
        Calculate My Score <ArrowRight size={18} />
      </Link>
    )}
  </TransitionPage>
);

const SourceCard = ({
  icon: Icon,
  title,
  source,
  data,
  done,
  loading,
  onClick
}: {
  icon: typeof CreditCard;
  title: string;
  source: string;
  data: string;
  done: boolean;
  loading: boolean;
  onClick: () => void;
}) => (
  <div className={`${card} flex items-center justify-between`}>
    <div>
      <div className="flex items-center gap-3">
        <Icon className="text-navy" />
        <div>
          <h3 className="font-semibold text-navy">{title}</h3>
          <p className="text-sm text-slate">{source}</p>
        </div>
      </div>
      {done && <p className="mt-3 text-sm text-success">✅ Verified · {data}</p>}
    </div>
    <button
      disabled={done || loading}
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${done ? 'bg-success text-white' : 'bg-teal text-white disabled:opacity-70'}`}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : done ? 'Verified' : 'Connect'}
    </button>
  </div>
);

const ScoreReveal = () => {
  const [phase, setPhase] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 2000);
    const t2 = setTimeout(() => setPhase(3), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const radius = 110;
  const c = 2 * Math.PI * radius;

  return (
    <TransitionPage className="min-h-[calc(100vh-3rem)] bg-navy p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <ConsumerSteps step={2} />
        <div className="flex min-h-[75vh] flex-col items-center justify-center text-center">
          {phase === 1 && (
            <>
              <Loader2 className="mb-4 animate-spin text-teal" size={48} />
              <p>Calculating your Global Financial Health Score...</p>
            </>
          )}
          {phase >= 2 && (
            <div className="relative mb-6">
              <svg width="300" height="220" viewBox="0 0 300 220">
                <path d="M 55 170 A 110 110 0 1 1 245 170" stroke="#1E3A5F" strokeWidth="16" fill="none" strokeLinecap="round" />
                <motion.path
                  d="M 55 170 A 110 110 0 1 1 245 170"
                  stroke="#00D4BF"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  initial={{ strokeDashoffset: c }}
                  animate={{ strokeDashoffset: c * (1 - 0.72) }}
                  transition={{ duration: 1.5 }}
                />
              </svg>
              <div className="absolute inset-0 mt-20">
                <div className="text-5xl font-heading text-teal">B+</div>
                <div className="text-sm text-slate-300">Strong</div>
              </div>
            </div>
          )}
          {phase >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
              <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {['748 Credit Score', '60 months Rent History', '$87,400 Annual Income', '0 Missed Payments'].map((s) => (
                  <div key={s} className="rounded-xl bg-navy-mid p-3 text-sm">
                    {s}
                  </div>
                ))}
              </div>
              <div className="mb-4 flex justify-center gap-3 text-sm text-slate-300">
                {['A+', 'A', 'B+', 'B', 'C+', 'C', 'Inc'].map((g) => (
                  <span key={g} className={g === 'B+' ? 'rounded px-2 py-1 text-teal bg-teal/20' : ''}>
                    {g}
                  </span>
                ))}
              </div>
              <p className="mb-6 italic text-slate-300">B+ — Strong. A median responsible adult lands B to B+.</p>
              <button onClick={() => navigate('/consumer/consent')} className="rounded-xl bg-teal px-6 py-3 font-medium">
                Set My Consent Preferences →
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </TransitionPage>
  );
};

const ConsentDashboard = ({
  consent,
  setConsent
}: {
  consent: Record<ConsentKey, boolean>;
  setConsent: React.Dispatch<React.SetStateAction<Record<ConsentKey, boolean>>>;
}) => {
  const rows: [ConsentKey, string, boolean][] = [
    ['GFHS Letter Grade', 'Your overall B+ score', true],
    ['60-Month Rent History', 'Payment consistency over 5 years', false],
    ['Income Band', 'Verified range ($80K–$90K)', false],
    ['Exact Income Figure', 'Precise income: $87,400', false],
    ['Credit Score', 'Foreign bureau score: 748', false],
    ['Employment Status', 'Full-time Software Engineer', false],
    ['Tax Return Verification', '3 years CRA-verified', false],
    ['Net Worth', 'Assets minus liabilities', false]
  ];

  return (
    <TransitionPage className="mx-auto max-w-6xl p-8">
      <ConsumerSteps step={3} />
      <h1 className="font-heading text-4xl text-navy">You decide what your landlord sees.</h1>
      <p className="mb-6 mt-2 text-slate">Granular control. Revocable at any time. No consent = no access.</p>
      <div className={`${card} overflow-hidden p-0`}>
        {rows.map(([key, desc, locked], i) => (
          <div key={key} className={`grid grid-cols-3 items-center gap-4 px-5 py-4 ${i < rows.length - 1 ? 'border-b' : ''}`}>
            <div className="font-medium">{key}</div>
            <div className="text-sm text-slate">{desc}</div>
            <div className="justify-self-end">
              {locked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal/20 px-3 py-1 text-sm text-teal">
                  <Lock size={14} /> ON
                </span>
              ) : (
                <button
                  onClick={() => setConsent((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={`h-7 w-12 rounded-full p-1 ${consent[key] ? 'bg-teal' : 'bg-slate-300'}`}
                >
                  <div className={`h-5 w-5 rounded-full bg-white transition ${consent[key] ? 'translate-x-5' : ''}`} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-navy p-5 text-white">
        <h3 className="mb-3 font-semibold">Your landlord will see:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(Object.keys(consent) as ConsentKey[]).map((k) => (
            <div key={k}>{consent[k] ? '✅' : '❌'} {k}</div>
          ))}
        </div>
      </div>
      <Link className="mt-6 inline-flex rounded-xl bg-teal px-6 py-3 font-medium text-white" to="/consumer/ready">
        Generate My Passport Link →
      </Link>
    </TransitionPage>
  );
};

const PassportReady = () => {
  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(today.getDate() + 90);
  return (
    <TransitionPage className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-8">
      <div className="w-full max-w-3xl text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
          <Check />
        </motion.div>
        <h1 className="mb-6 font-heading text-4xl text-navy">Your Financial Passport is ready.</h1>
        <div className="rounded-2xl bg-navy p-6 text-left text-white">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">JK</div>
              <div>
                <p className="font-semibold">Jordan Kim</p>
                <p className="text-sm text-slate-300">Financial Passport · Verified</p>
              </div>
            </div>
            <span className="rounded-full bg-teal/20 px-3 py-1 text-teal">B+</span>
          </div>
          <p className="text-sm text-slate-300">Issued: {today.toLocaleDateString()} · Expires: {expiry.toLocaleDateString()}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {['Rent History', 'Income Band', 'Employment', 'GFHS'].map((b) => (
              <span key={b} className="rounded-full bg-white/10 px-3 py-1">{b}</span>
            ))}
          </div>
        </div>
        <div className={`${card} mt-5 flex items-center justify-between`}>
          <span className="text-slate">financialpassport.io/p/jordan-kim-a8f3</span>
          <button className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"><Copy size={14} />Copy</button>
        </div>
        <Link className="mt-5 inline-flex rounded-xl bg-teal px-6 py-3 font-medium text-white" to="/landlord/application">
          Share with Landlord
        </Link>
        <p className="mt-4 text-sm text-slate">This passport expires in 90 days. Jordan controls all access.</p>
      </div>
    </TransitionPage>
  );
};

const LandlordLogin = () => (
  <TransitionPage className="min-h-[calc(100vh-3rem)] bg-slate-100 p-8">
    <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-sm">
      <div className="rounded-t-2xl bg-navy px-6 py-5 text-white">
        <h1 className="font-heading text-3xl">Financial Passport · Landlord Portal</h1>
      </div>
      <div className="p-6">
        <p className="mb-4 text-slate">You&apos;ve received a verified Financial Passport from an applicant.</p>
        <input className="mb-4 w-full rounded-xl border px-4 py-3" value="financialpassport.io/p/jordan-kim-a8f3" readOnly />
        <Link className="inline-flex rounded-xl bg-success px-6 py-3 font-medium text-white" to="/landlord/application">View Verified Application</Link>
        <p className="mt-4 text-sm text-slate">Financial Passport provides verified intelligence only. All tenancy decisions are made solely by you.</p>
      </div>
    </div>
  </TransitionPage>
);

const ApplicationView = ({ showModal, setShowModal }: { showModal: boolean; setShowModal: (v: boolean) => void }) => (
  <TransitionPage className="min-h-[calc(100vh-3rem)] bg-slate-100 p-6">
    <div className="mx-auto flex max-w-7xl gap-6">
      <aside className="w-[280px] space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy text-xl text-white">JK</div>
        <div className="text-center">
          <h2 className="font-semibold text-navy">Jordan Kim</h2>
          <p className="text-sm text-slate">Applied today</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-teal to-teal-light p-4 text-white">
          <p className="text-4xl font-heading">B+</p>
          <p className="text-sm">GFHS · Strong</p>
        </div>
        <div className="text-sm text-slate">Unit 4B · $2,400/mo · 12-month lease</div>
        <div className="rounded-lg bg-success/15 px-3 py-2 text-sm text-success">Layer 3 Verified · Financial Passport</div>
        <div className="rounded-lg bg-orange-100 p-3 text-xs text-orange-700">Financial Passport provides verified intelligence only. All tenancy decisions are made solely by you.</div>
      </aside>

      <section className="flex-1 space-y-4">
        <div className={card}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="rounded-full bg-success/20 p-2"><Home className="text-success" size={18} /></span><div><h3 className="font-semibold text-navy">Rental History</h3><p className="text-sm text-slate">Plaid · Property Management API</p></div></div>
            <span className="text-sm text-success">Verified</span>
          </div>
          <div className="mb-4 flex h-16 items-end gap-1">{new Array(12).fill(0).map((_, i) => <div key={i} className="w-5 rounded-t bg-success" style={{ height: `${30 + (i % 3) * 8}px` }} />)}</div>
          <p className="text-sm text-slate">60 months total · 0 missed · 0 late · Last rent $2,100/mo · Toronto ON</p>
        </div>

        <div className={card}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="rounded-full bg-blue-100 p-2"><Briefcase className="text-blue-600" size={18} /></span><div><h3 className="font-semibold text-navy">Income & Employment</h3><p className="text-sm text-slate">CRA</p></div></div>
            <span className="text-sm text-success">Verified</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm"><Info k="Income band" v="$80,000–$90,000 CAD/yr" /><Info k="Employment" v="Full-time" /><Info k="Occupation" v="Software Engineer" /><Info k="Tax verification" v="3 years verified" /></div>
          <div className="mt-4 rounded-xl bg-success/10 p-3 text-success">Rent-to-income ratio 32% ✅ Below 33% guideline</div>
        </div>

        <div className={card}>
          <div className="mb-4 flex items-center gap-3"><span className="rounded-full bg-teal/20 p-2"><TrendingUp className="text-teal" size={18} /></span><h3 className="font-semibold text-navy">GFHS Score Components</h3></div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Component title="Debt Quality" value="Tier 1 — Productive ✅" />
            <Component title="Payment Consistency" value="Excellent ✅" />
            <Component title="Income Stability" value="Verified ✅" />
            <Component title="Credit Profile" value="Strong ✅" />
          </div>
          <p className="mt-4 italic text-slate">"B+ — Strong. A median responsible adult lands B to B+."</p>
        </div>

        <div className="rounded-2xl bg-slate-200 p-4 text-slate-600">
          <div className="mb-2 flex items-center gap-2 font-medium"><Lock size={16} />Hidden by applicant</div>
          <div className="flex gap-2 text-sm"><span className="rounded-full bg-slate-300 px-3 py-1">Exact income figure 🔒</span><span className="rounded-full bg-slate-300 px-3 py-1">Credit score 🔒</span><span className="rounded-full bg-slate-300 px-3 py-1">Tax returns 🔒</span></div>
          <p className="mt-2 text-xs">Jordan controls what is shared...</p>
        </div>

        <div className="flex gap-3">
          <Link to="/landlord/decision" className="flex-1 rounded-xl bg-success px-5 py-3 text-center font-medium text-white">✅ Approve Application</Link>
          <button onClick={() => setShowModal(true)} className="rounded-xl border border-navy px-5 py-3 text-navy">Request More Information</button>
        </div>
      </section>
    </div>

    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
        <div className="rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
          <h3 className="mb-2 font-semibold">Request sent</h3>
          <p className="mb-3 text-sm text-slate">The applicant has been asked for additional information.</p>
          <button className="rounded-lg bg-teal px-4 py-2 text-white" onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
    )}
  </TransitionPage>
);

const Info = ({ k, v }: { k: string; v: string }) => (
  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-slate">{k}</p>
    <p className="font-medium text-navy">{v}</p>
  </div>
);

const Component = ({ title, value }: { title: string; value: string }) => (
  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-slate">{title}</p>
    <p className="font-medium text-navy">{value}</p>
  </div>
);

const DecisionScreen = () => (
  <TransitionPage className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center bg-navy p-8 text-center text-white">
    <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-success">
      <Check size={44} />
    </motion.div>
    <h1 className="font-heading text-5xl">Application Approved</h1>
    <p className="mt-3 text-lg text-slate-300">Jordan Kim — Unit 4B — 12-month lease</p>
    <ul className="mt-6 space-y-2 text-left text-slate-200">
      <li>✅ Verified 60-month rent history — 0 missed payments</li>
      <li>✅ Rent-to-income ratio: 32% — within guidelines</li>
      <li>✅ GFHS Grade: B+ (Strong)</li>
    </ul>
    <Link to="/landlord" className="mt-6 rounded-xl border border-white px-6 py-3">Back to Portal</Link>
    <p className="mt-4 text-sm text-slate-400">Jordan will be notified that their passport was viewed and this decision was recorded.</p>
  </TransitionPage>
);

export default App;
