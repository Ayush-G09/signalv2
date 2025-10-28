import React, { useState } from 'react';
import StockSignals from './StockSignals';

type Stock = {
  symbol: string,
  name: string
};

type Scores = {
  [symbol: string]: number
};

const stocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'NVDA', name: 'Nvidia' },
  { symbol: 'RELIANCE.NS', name: 'Reliance' },
  { symbol: 'IDEA.NS', name: 'Idea Cellular' },
  { symbol: 'ARIHANTCAP.NS', name: 'Arihant Capital' },
  { symbol: '^NSEI', name: 'Nifty 50' },
  { symbol: '^NSEBANK', name: 'Nifty Bank' },
  { symbol: '^CNXAUTO', name: 'Nifty Auto' },
  { symbol: 'NIFTY_FIN_SERVICE.NS', name: 'Nifty Finance Service' },
  { symbol: '^CNXENERGY', name: 'Nifty Energy' },
  { symbol: '^CNXIT', name: 'Nifty IT' },
  { symbol: '^CNXPHARMA', name: 'Nifty Pharma' },
];

function App() {
  // Specify the type for scores
  const [scores, setScores] = useState<Scores>({});

  const handleScoreChange = (symbol: string, score: number) => {
    setScores(prev => ({ ...prev, [symbol]: score }));
  };

  const sortedStocks = [...stocks].sort(
    (a, b) => (scores[b.symbol] ?? 0) - (scores[a.symbol] ?? 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Signals Dashboard</h1>
        <p className="text-gray-600">Real-time signals for selected stocks</p>
      </header>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sortedStocks.map((stock) => (
          <StockSignals
            key={stock.symbol}
            symbol={stock.symbol}
            onScoreChange={handleScoreChange}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
