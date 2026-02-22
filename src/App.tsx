import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Utensils, 
  Dumbbell, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar,
  Flame,
  Zap
} from 'lucide-react';
import { PLAN_DATA, WEEKLY_ACTIVITY, getDayType } from './constants';
import { Meal, Activity, ProgressItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'nutrition' | 'activity'>('home');
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const today = useMemo(() => {
    const d = new Date(currentTime);
    return d.toISOString().split('T')[0];
  }, [currentTime]);

  const dayOfWeek = currentTime.getDay();
  const dayType = getDayType(dayOfWeek);
  
  const dailyPlan = useMemo(() => {
    const plan = { ...PLAN_DATA[dayType] };
    plan.activity = WEEKLY_ACTIVITY[dayOfWeek] || [];
    return plan;
  }, [dayType, dayOfWeek]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(`/api/progress/${today}`)
      .then(res => res.json())
      .then(data => setProgress(data));
  }, [today]);

  const toggleProgress = async (item_id: string, type: 'nutrition' | 'activity') => {
    const isCompleted = progress.some(p => p.item_id === item_id && p.type === type);
    const newCompleted = !isCompleted;

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, item_id, type, completed: newCompleted })
      });

      if (newCompleted) {
        setProgress([...progress, { item_id, type }]);
      } else {
        setProgress(progress.filter(p => !(p.item_id === item_id && p.type === type)));
      }
    } catch (err) {
      console.error('Failed to update progress', err);
    }
  };

  const getNextItem = <T extends { time: string }>(items: T[]): T | null => {
    if (!items.length) return null;
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const sorted = [...items].sort((a, b) => {
      const [ha, ma] = a.time.split(':').map(Number);
      const [hb, mb] = b.time.split(':').map(Number);
      return (ha * 60 + ma) - (hb * 60 + mb);
    });

    return sorted.find(item => {
      const [h, m] = item.time.split(':').map(Number);
      return (h * 60 + m) > now;
    }) || sorted[0] || null;
  };

  const nextMeal = getNextItem(dailyPlan.nutrition) as Meal | null;
  const nextActivity = getNextItem(dailyPlan.activity) as Activity | null;

  const renderHome = () => (
    <div className="space-y-6 pb-32">
      <header className="px-6 pt-10 pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">¡Hola! 👋</h1>
        <p className="text-zinc-500 font-medium mt-1">
          Hoy es {new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(currentTime)}
        </p>
      </header>

      <section className="px-6 space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
          <Clock size={12} /> PRÓXIMO EN TU PLAN
        </h2>
        
        {nextMeal && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex items-center gap-5"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600">
              <Utensils size={28} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">{nextMeal.time}</p>
              <h3 className="text-lg font-bold text-zinc-900 leading-tight">{nextMeal.name}</h3>
              <p className="text-sm text-zinc-500 line-clamp-1">{nextMeal.description}</p>
            </div>
            <button 
              onClick={() => toggleProgress(nextMeal.id, 'nutrition')}
              className="transition-transform active:scale-90"
            >
              {progress.some(p => p.item_id === nextMeal.id && p.type === 'nutrition') ? 
                <CheckCircle2 size={32} className="text-emerald-500 fill-emerald-50" /> : 
                <Circle size={32} className="text-zinc-200" />
              }
            </button>
          </motion.div>
        )}

        {nextActivity && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex items-center gap-5"
          >
            <div className="w-14 h-14 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
              <Dumbbell size={28} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">{nextActivity.time}</p>
              <h3 className="text-lg font-bold text-zinc-900 leading-tight">{nextActivity.name}</h3>
              <p className="text-sm text-zinc-500">{nextActivity.duration || 'Sesión'}</p>
            </div>
            <button 
              onClick={() => toggleProgress(nextActivity.id, 'activity')}
              className="transition-transform active:scale-90"
            >
              {progress.some(p => p.item_id === nextActivity.id && p.type === 'activity') ? 
                <CheckCircle2 size={32} className="text-indigo-500 fill-indigo-50" /> : 
                <Circle size={32} className="text-zinc-200" />
              }
            </button>
          </motion.div>
        )}
      </section>

      <section className="px-6 grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-6 rounded-[2.5rem] text-white shadow-xl shadow-zinc-200">
          <Flame size={24} className="text-orange-400 mb-3" />
          <p className="text-3xl font-black tracking-tight">~2450</p>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">kcal objetivo</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Zap size={24} className="text-yellow-500 mb-3" />
          <p className="text-3xl font-black tracking-tight text-zinc-900">190g</p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Proteína diaria</p>
        </div>
      </section>
    </div>
  );

  const renderNutrition = () => (
    <div className="space-y-6 pb-32 px-6 pt-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Nutrición</h1>
        <p className="text-zinc-500 font-medium mt-1">{dayType === 'RUGBY' ? 'Día de Rugby (Alto Rendimiento)' : 'Día de Control'}</p>
      </header>

      <div className="space-y-4">
        {dailyPlan.nutrition.map((meal, idx) => {
          const isDone = progress.some(p => p.item_id === meal.id && p.type === 'nutrition');
          return (
            <motion.div 
              key={meal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${isDone ? 'bg-zinc-50 border-zinc-100 opacity-60' : 'bg-white border-zinc-100 shadow-sm'}`}
            >
              <div className="pt-1">
                <button onClick={() => toggleProgress(meal.id, 'nutrition')} className="active:scale-90 transition-transform">
                  {isDone ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-zinc-200" />}
                </button>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold text-lg leading-tight ${isDone ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>{meal.name}</h3>
                  <span className="text-[10px] font-black text-zinc-400 tracking-widest">{meal.time}</span>
                </div>
                <p className={`text-sm leading-relaxed ${isDone ? 'text-zinc-400' : 'text-zinc-500'}`}>{meal.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-[10px] font-black px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full uppercase tracking-wider">{meal.kcal} kcal</span>
                  {meal.protein && <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full uppercase tracking-wider">{meal.protein}g Prot</span>}
                  {meal.isQuickCarb && <span className="text-[10px] font-black px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full uppercase tracking-wider">Carb Rápido</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6 pb-32 px-6 pt-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Actividad</h1>
        <p className="text-zinc-500 font-medium mt-1">Rutina y Entrenamiento</p>
      </header>

      {dailyPlan.activity.length === 0 ? (
        <div className="bg-zinc-50 p-12 rounded-[2.5rem] text-center border border-dashed border-zinc-200">
          <Calendar className="mx-auto text-zinc-300 mb-4" size={48} />
          <p className="text-zinc-500 font-bold">No hay actividades programadas para hoy.</p>
          <p className="text-zinc-400 text-sm mt-1">¡Disfruta tu descanso!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dailyPlan.activity.map((act, idx) => {
            const isDone = progress.some(p => p.item_id === act.id && p.type === 'activity');
            return (
              <motion.div 
                key={act.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-[2.5rem] border overflow-hidden transition-all ${isDone ? 'bg-zinc-50 border-zinc-100 opacity-60' : 'bg-white border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
              >
                <div className="p-6 border-b border-zinc-50 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">{act.time}</p>
                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight">{act.name}</h3>
                  </div>
                  <button onClick={() => toggleProgress(act.id, 'activity')} className="active:scale-90 transition-transform">
                    {isDone ? <CheckCircle2 size={36} className="text-indigo-500" /> : <Circle size={36} className="text-zinc-200" />}
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {act.exercises.map((ex, eIdx) => (
                    <div key={eIdx} className="flex justify-between items-center group">
                      <span className="text-zinc-700 font-semibold group-hover:text-zinc-900 transition-colors">{ex.name}</span>
                      {ex.sets && <span className="text-[10px] font-black bg-zinc-100 text-zinc-500 px-3 py-1.5 rounded-xl uppercase tracking-widest">{ex.sets}</span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-zinc-900 selection:bg-emerald-100">
      <main className="max-w-md mx-auto min-h-screen relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderHome()}</motion.div>}
          {activeTab === 'nutrition' && <motion.div key="nutrition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderNutrition()}</motion.div>}
          {activeTab === 'activity' && <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderActivity()}</motion.div>}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-50 pointer-events-none">
          <nav className="w-full max-w-[320px] bg-zinc-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2rem] px-4 py-3 flex justify-between items-center pointer-events-auto">
            <button 
              onClick={() => setActiveTab('nutrition')}
              className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeTab === 'nutrition' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Utensils size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Nutrición</span>
            </button>
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Home size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Inicio</span>
            </button>
            <button 
              onClick={() => setActiveTab('activity')}
              className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeTab === 'activity' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Dumbbell size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Actividad</span>
            </button>
          </nav>
        </div>
      </main>
    </div>
  );
}
