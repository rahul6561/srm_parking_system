import React from 'react';
import { useParkingData } from '../../context/ParkingContext';
import { ArrowDownRight, ArrowUpRight, Cpu, Info, X } from 'lucide-react';

const ToastNotification = () => {
  const { toasts, removeToast } = useParkingData();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isEntry = toast.type === 'ENTRY';
        const isExit = toast.type === 'EXIT';
        const isSensor = toast.type === 'SENSOR';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 bg-[#0F1E36]/95 border border-slate-700/80 shadow-2xl rounded-xl p-3.5 backdrop-blur-md flex items-start gap-3"
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                isEntry
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isExit
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : isSensor
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {isEntry && <ArrowDownRight className="w-5 h-5" />}
              {isExit && <ArrowUpRight className="w-5 h-5" />}
              {isSensor && <Cpu className="w-5 h-5" />}
              {!isEntry && !isExit && !isSensor && <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide truncate">
                  {toast.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {toast.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-800/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastNotification;
