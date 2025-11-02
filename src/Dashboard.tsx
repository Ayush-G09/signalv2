import React, { useState } from "react";
import StockSignals from "./StockSignals";
import { useNavigate } from "react-router-dom";

type Stock = {
  symbol: string;
  name: string;
};

type AdxData = {
  adx: number;
  plusDI: number;
  minusDI: number;
};

const stocks: Stock[] = [
  { symbol: "^NSEI", name: "Nifty 50" },
  { symbol: "^NSEBANK", name: "Nifty Bank" },
  { symbol: "^CNXAUTO", name: "Nifty Auto" },
  { symbol: "NIFTY_FIN_SERVICE.NS", name: "Nifty Financial Services" },
  { symbol: "^CNXFMCG", name: "Nifty FMCG" },
  { symbol: "^CNXIT", name: "Nifty IT" },
  { symbol: "^CNXMEDIA", name: "Nifty Media" },
  { symbol: "^CNXMETAL", name: "Nifty Metal" },
  { symbol: "^CNXPHARMA", name: "Nifty Pharma" },
  { symbol: "^CNXPSUBANK", name: "Nifty PSU Bank" },
  { symbol: "^CNXREALTY", name: "Nifty Realty" },
  { symbol: "NIFTY_OIL_AND_GAS.NS", name: "Nifty Oil & Gas" },
  { symbol: "^CNXENERGY", name: "Nifty Energy" },
  { symbol: "NIFTY_CONSR_DURBL.NS", name: "Consumer" },
  { symbol: "NIFTY_HEALTHCARE.NS", name: "Healthcare" },
];

function Dashboard() {
  const [signals, setSignals] = useState<{ [symbol: string]: AdxData }>({});

  const navigate = useNavigate();

  const handleSignalUpdate = (symbol: string, data: AdxData) => {
    setSignals((prev) => ({ ...prev, [symbol]: data }));
  };

  const buyStocks = stocks.filter((stock) => {
    const s = signals[stock.symbol];
    return s && s.adx > 25 && s.plusDI > 25;
  });

  const sellStocks = stocks.filter((stock) => {
    const s = signals[stock.symbol];
    return s && s.adx > 25 && s.minusDI > 25;
  });

  const holdStocks = stocks.filter(
    (stock) =>
      !signals[stock.symbol] ||
      !(
        signals[stock.symbol].adx > 25 &&
        (signals[stock.symbol].plusDI > 25 ||
          signals[stock.symbol].minusDI > 25)
      )
  );

  const renderSection = (title: string, stocksList: Stock[]) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
      {stocksList.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stocksList.map((stock) => (
            <StockSignals
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              onSignalUpdate={handleSignalUpdate}
              onClick={() => navigate(`/stocks/${stock.symbol}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          No stocks in this category yet...
        </p>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Stock Signals Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time signals categorized by ADX strength
        </p>
      </header>

      {renderSection("🟢 Buy", buyStocks)}
      {renderSection("🟡 Hold", holdStocks)}
      {renderSection("🔴 Sell", sellStocks)}
    </div>
  );
}

export default Dashboard;
