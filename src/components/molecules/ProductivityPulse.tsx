"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', completed: 4 },
    { name: 'Tue', completed: 7 },
    { name: 'Wed', completed: 5 },
    { name: 'Thu', completed: 12 },
    { name: 'Fri', completed: 9 },
    { name: 'Sat', completed: 6 },
    { name: 'Sun', completed: 8 },
];

const ProductivityPulse = () => {
    return (
        <div className="premium-glass p-12 h-[400px] w-full relative overflow-hidden group rounded-[40px]">
            {/* Dynamic Glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-blue/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-purple/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="flex items-start justify-between mb-16 relative z-10">
                <div>
                    <h3 className="text-3xl font-black tracking-tight text-white mb-2">
                        Productivity Pulse
                    </h3>
                    <p className="text-slate-400 font-medium tracking-wide">Flow state analysis for the current week</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                        <span className="text-4xl font-black text-accent-blue text-glow">+18%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Momentum Boost</p>
                </div>
            </div>

            <div className="h-48 w-full relative z-10 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#256af4" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#256af4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 14, 20, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                padding: '16px'
                            }}
                            itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: '800' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="completed"
                            stroke="#256af4"
                            fillOpacity={1}
                            fill="url(#colorPulse)"
                            strokeWidth={6}
                            animationDuration={2500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center mt-10 px-4 relative z-10">
                {data.map((day) => (
                    <div key={day.name} className="flex flex-col items-center gap-3">
                        <span className={`text-[11px] font-black uppercase tracking-widest ${day.completed > 8 ? 'text-white' : 'text-slate-600'}`}>
                            {day.name}
                        </span>
                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${day.completed > 8
                                ? 'bg-accent-blue shadow-[0_0_15px_#256af4]'
                                : 'bg-white/10'
                            }`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductivityPulse;
