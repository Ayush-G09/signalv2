import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FaChartLine, FaClock, FaExchangeAlt } from 'react-icons/fa';

const SOCKET_SERVER_URL = 'https://signalsv2-backend.onrender.com';

const scoreSignal = (signals) => {
  let score = 0;
  ['intraday', 'swing'].forEach((strategy) => {
    if (signals[strategy]) {
      ['trend', 'setup', 'entry'].forEach((field) => {
        const val = signals[strategy][field];
        if (val === 'up') score += 1;
        else if (val === 'down') score -= 1;
      });
    }
  });
  return score;
};

const StockSignals = ({ symbol, onScoreChange }) => {
  const [signals, setSignals] = useState({});

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    ['intraday', 'swing'].forEach((strategy) => {
      socket.emit('subscribe', { symbol, strategy });
    });
    socket.on('signal', ({ symbol: s, strategy, signal }) => {
      if (s === symbol) {
        setSignals((prev) => {
          const updated = { ...prev, [strategy]: signal };
          if (onScoreChange) {
            onScoreChange(symbol, scoreSignal(updated));
          }
          return updated;
        });
      }
    });
    return () => {
      ['intraday', 'swing'].forEach((strategy) => {
        socket.emit('unsubscribe', { symbol, strategy });
      });
      socket.disconnect();
    };
    // Notify score on mount (initial signals)
    // eslint-disable-next-line
  }, [symbol]);

  const colorize = (val) => {
    if (!val) return 'text-gray-400';
    if (val.toLowerCase().includes('buy') || val === 'up') return 'text-green-600 font-semibold';
    if (val.toLowerCase().includes('sell') || val === 'down') return 'text-red-600 font-semibold';
    return 'text-gray-600';
  };

  const score = scoreSignal(signals);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-7">
      <header className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
        <FaChartLine className="text-indigo-600 w-5 h-5" />
        <h2 className="text-xl font-extrabold text-gray-900">{symbol}</h2>
        <span className="ml-auto text-sm text-indigo-800 font-bold">Score: {score}</span>
      </header>
      <div className="grid grid-cols-2 gap-6">
        {/* Intraday */}
        <section className="bg-indigo-50 rounded-lg p-5 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <FaClock className="text-indigo-600 w-4 h-4" />
            <span className="font-semibold text-indigo-900 uppercase tracking-wide">Intraday</span>
          </div>
          {signals.intraday ? (
            <div className="space-y-2 text-sm">
              <p>
                Trend: <span className={colorize(signals.intraday.trend)}>{signals.intraday.trend}</span>
              </p>
              <p>
                Setup: <span className={colorize(signals.intraday.setup)}>{signals.intraday.setup}</span>
              </p>
              <p>
                Entry: <span className={colorize(signals.intraday.entry)}>{signals.intraday.entry}</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">Waiting for intraday signals...</p>
          )}
        </section>
        {/* Swing */}
        <section className="bg-green-50 rounded-lg p-5 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <FaExchangeAlt className="text-green-600 w-4 h-4" />
            <span className="font-semibold text-green-900 uppercase tracking-wide">Swing</span>
          </div>
          {signals.swing ? (
            <div className="space-y-2 text-sm">
              <p>
                Trend: <span className={colorize(signals.swing.trend)}>{signals.swing.trend}</span>
              </p>
              <p>
                Setup: <span className={colorize(signals.swing.setup)}>{signals.swing.setup}</span>
              </p>
              <p>
                Entry: <span className={colorize(signals.swing.entry)}>{signals.swing.entry}</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">Waiting for swing signals...</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default StockSignals;
