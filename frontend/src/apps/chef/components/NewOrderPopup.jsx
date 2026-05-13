import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, MapPin, Clock, ShoppingBag } from 'lucide-react';

const NewOrderPopup = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  const order = {
    id: '#8821',
    customer: 'Nayan Yadla',
    items: [
      { name: 'Special Paneer Thali', qty: 2, price: 598 },
      { name: 'Butter Naan', qty: 4, price: 240 }
    ],
    total: 838,
    station: 'Raipur Junction',
    time: 'Just now'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-[400px] rounded-[28px] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 mb-1">New Order</p>
              <h2 className="text-2xl font-black text-slate-900">Order {order.id}</h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Customer & Location */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{order.customer}</p>
                <p className="text-xs text-slate-400">{order.station}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
               <div className="flex items-center gap-1.5 bg-slate-200 px-3 py-1.5 rounded-full">
                  <Clock size={12} />
                  <span>{order.time}</span>
               </div>
               <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Paid Online</span>
               </div>
            </div>
          </div>

          {/* Items */}
          <div className="border-y border-slate-100 py-6 mb-8">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold">{item.qty}x</span>
                    <p className="font-semibold text-slate-700">{item.name}</p>
                  </div>
                  <p className="font-black text-slate-900">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Bill</p>
              <p className="text-3xl font-black text-slate-900">₹{order.total}</p>
            </div>
            <ShoppingBag size={24} className="text-orange-500 mb-1" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 text-xs font-bold text-slate-300 hover:text-slate-500 transition-colors"
            >
              DECLINE
            </button>
            <button 
              onClick={onAccept}
              className="flex-[2] bg-orange-500 text-white py-4 rounded-2xl text-xs font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all"
            >
              ACCEPT ORDER
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NewOrderPopup;
