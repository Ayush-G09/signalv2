import React, { useEffect, useState } from 'react';
import { socket } from './socket';
import { FaChartLine, FaExchangeAlt, FaBalanceScale } from 'react-icons/fa';

const StockSignals = ({ symbol, name, onSignalUpdate, onClick}) => {
  const [signals, setSignals] = useState({});

  useEffect(() => {
    // Subscribe to backend for this symbol
    ['swing', 'adx'].forEach((strategy) => {
      socket.emit('subscribe', { symbol, strategy });
    });

    const handleSignal = ({ symbol: s, strategy, signal }) => {
      if (s === symbol) {
        setSignals((prev) => {
          const updated = { ...prev, [strategy]: signal };
          if (strategy === 'adx' && onSignalUpdate) {
            onSignalUpdate(symbol, signal);
          }
          return updated;
        });
      }
    };

    socket.on('signal', handleSignal);

    // Cleanup on unmount
    return () => {
      ['swing', 'adx'].forEach((strategy) => {
        socket.emit('unsubscribe', { symbol, strategy });
      });
      socket.off('signal', handleSignal);
    };
  }, [symbol, onSignalUpdate]);

  const colorize = (val) => {
    if (!val) return 'text-gray-400';
    if (typeof val === 'string') {
      if (val.toLowerCase().includes('buy') || val === 'up')
        return 'text-green-600 font-semibold';
      if (val.toLowerCase().includes('sell') || val === 'down')
        return 'text-red-600 font-semibold';
    }
    return 'text-gray-600';
  };

  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-md border border-gray-200 p-7 cursor-pointer">
      <header className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
        <FaChartLine className="text-indigo-600 w-5 h-5" />
        <h2 className="text-xl font-extrabold text-gray-900">{name}</h2>
      </header>

      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6">
        {/* Swing Section */}
        <section className="bg-green-50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <FaExchangeAlt className="text-green-600 w-4 h-4" />
            <span className="font-semibold text-green-900 uppercase tracking-wide">
              Trend
            </span>
          </div>
          {signals.swing ? (
            <div className="space-y-2 text-sm">
              <p>
                1 Day:{' '}
                <span className={colorize(signals.swing.trend)}>
                  {signals.swing.trend}
                </span>
              </p>
              <p>
                1 Hr:{' '}
                <span className={colorize(signals.swing.setup)}>
                  {signals.swing.setup}
                </span>
              </p>
              <p>
                15 Min:{' '}
                <span className={colorize(signals.swing.entry)}>
                  {signals.swing.entry}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">Waiting for swing signals...</p>
          )}
        </section>

        {/* ADX Section */}
        <section className="bg-yellow-50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <FaBalanceScale className="text-yellow-600 w-4 h-4" />
            <span className="font-semibold text-yellow-900 uppercase tracking-wide">
              ADX
            </span>
          </div>
          {signals.adx ? (
            <div className="space-y-2 text-sm">
              <p>
                ADX:{' '}
                <span className="text-gray-700 font-medium">
                  {signals.adx.adx}
                </span>
              </p>
              <p>
                +DI:{' '}
                <span className="text-green-700 font-medium">
                  {signals.adx.plusDI}
                </span>
              </p>
              <p>
                -DI:{' '}
                <span className="text-red-700 font-medium">
                  {signals.adx.minusDI}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">Waiting for ADX signal...</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default StockSignals;
