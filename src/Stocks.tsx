import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StockSignals from "./StockSignals";

type Stock = {
  symbol: string;
  stocks: string[];
};

type AdxData = {
  adx: number;
  plusDI: number;
  minusDI: number;
};

const stocks: Stock[] = [
  { symbol: "^NSEI", stocks: ['']},
  { symbol: "^NSEBANK", stocks: ['IDFCFIRSTB.NS', 'PNB.NS', 'AUBANK.NS', 'INDUSINDBK.NS', 'BANKBARODA.NS', 'KOTAKBANK.NS', 'AXISBANK.NS', 'FEDERALBNK.NS', 'SBIN.NS', 'ICICIBANK.NS', 'HDFCBANK.NS']},
  { symbol: "^CNXAUTO", stocks: ['TATAMOTORS.NS', 'MARUTI.NS', 'EICHERMOT.NS', 'MOTHERSON.NS', 'BOSCHLTD.NS', 'TVSMOTOR.NS', 'M&M.NS', 'ASHOKLEY.NS', 'EXIDEIND.NS', 'BAJAJ-AUTO.NS', 'BHARATFORG.NS', 'HEROMOTOCO.NS', 'MRF.NS', 'BALKRISIND.NS', 'APOLLOTYRE.NS']},
  { symbol: "NIFTY_FIN_SERVICE.NS", stocks: ['RECLTD.NS', 'CHOLAFIN.NS', 'SBICARD.NS', 'ICICIPRULI.NS', 'SBILIFE.NS', 'PFC.NS', 'HDFCLIFE.NS', 'LICHSGFIN.NS', 'ICICIGI.NS', 'KOTAKBANK.NS', 'BAJAJFINSV.NS', 'AXISBANK.NS', 'SBIN.NS', 'MUTHOOTFIN.NS', 'HDFCAMC.NS', 'ICICIBANK.NS', 'HDFCBANK.NS', 'MCX.NS']},
  { symbol: "^CNXFMCG", stocks: ['DABUR.NS', 'GODREJCP.NS', 'NESTLEIND.NS', 'HINDUNILVR.NS', 'COLPAL.NS', 'BRITANNIA.NS', 'MARICO.NS', 'PGHH.NS', 'TATACONSUM.NS', 'VBL.NS', 'RADICO.NS', 'UBL.NS', 'UNITDSPR.NS', 'ITC.NS', 'BALRAMCHIN.NS']},
  { symbol: "^CNXIT", stocks: ['LTIM.NS', 'COFORGE.NS', 'LTTS.NS', 'INFY.NS', 'MPHASIS.NS', 'PERSISTENT.NS', 'HCLTECH.NS', 'TCS.NS', 'TECHM.NS', 'WIPRO.NS']},
  { symbol: "^CNXMEDIA", stocks: ['SAREGAMA.NS', 'TIPSMUSIC.NS', 'NETWORK18.NS', 'ZEEL.NS', 'HATHWAY.NS', 'DEN.NS', 'NAZARA.NS', 'DISHTV.NS', 'SUNTV.NS', 'PVRINOX.NS']},
  { symbol: "^CNXMETAL", stocks: ['HINDZINC.NS', 'APLAPOLLO.NS', 'VEDL.NS', 'JINDALSTEL.NS', 'TATASTEEL.NS', 'JSWSTEEL.NS', 'SAIL.NS', 'HINDCOPPER.NS', 'NMDC.NS', 'RATNAMANI.NS', 'JSL.NS', 'ADANIENT.NS', 'WELCORP.NS', 'HINDALCO.NS', 'NATIONALUM.NS']},
  { symbol: "^CNXPHARMA", stocks: ['GLAND.NS', 'MANKIND.NS', 'JBCHEPHARM.NS', 'GLENMARK.NS', 'IPCALAB.NS', 'GRANULES.NS', 'LAURUSLABS.NS', 'NATCOPHARM.NS', 'TORNTPHARM.NS', 'LUPIN.NS', 'BIOCON.NS', 'ALKEM.NS', 'SUNPHARMA.NS', 'ABBOTINDIA.NS', 'DIVISLAB.NS', 'DRREDDY.NS', 'ZYDUSLIFE.NS', 'CIPLA.NS', 'AUROPHARMA.NS', 'AJANTPHARM.NS']},
  { symbol: "^CNXPSUBANK", stocks: ['MAHABANK.NS', 'CENTRALBK.NS', 'UNIONBANK.NS', 'UCOBANK.NS', 'IOB.NS', 'PSB.NS', 'BANKINDIA.NS', 'BANKBARODA.NS', 'INDIANB.NS', 'CANBK.NS', 'SBIN.NS']},
  { symbol: "^CNXREALTY", stocks: ['LODHA.NS', 'MAHLIFE.NS', 'BRIGADE.NS', 'RAYMOND.NS', 'SOBHA.NS', 'PRESTIGE.NS', 'DLF.NS', 'OBEROIRLTY.NS', 'PHOENIXLTD.NS', 'GODREJPROP.NS']},
  { symbol: "NIFTY_OIL_AND_GAS.NS", stocks: ['ONGC.NS', 'IGL.NS', 'OIL.NS', 'MGL.NS', 'GUJGASLTD.NS', 'RELIANCE.NS', 'PETRONET.NS', 'IOC.NS', 'GAIL.NS', 'BPCL.NS', 'GSPL.NS', 'HINDPETRO.NS', 'CASTROLIND.NS', 'ATGL.NS', 'AEGISLOG.NS']},
  { symbol: "^CNXENERGY", stocks: ['ONGC.NS', 'IGL.NS', 'OIL.NS', 'THERMAX.NS', 'TRITURBINE.NS', 'ADANIENSOL.NS', 'MGL.NS', 'GUJGASLTD.NS', 'RELIANCE.NS', 'NLCINDIA.NS', 'NTPC.NS', 'PETRONET.NS', 'TATAPOWER.NS', 'NHPC.NS', 'COALINDIA.NS', 'JPPOWER.NS', 'POWERGRID.NS', 'IOC.NS', 'GAIL.NS', 'BPCL.NS', 'GSPL.NS', 'HINDPETRO.NS', 'SJVN.NS', 'POWERINDIA.NS', 'ADANIPOWER.NS', 'CASTROLIND.NS', 'ADANIGREEN.NS', 'ATGL.NS', 'BHEL.NS', 'JSWENERGY.NS', 'AEGISLOG.NS', 'SIEMENS.NS', 'SUZLON.NS', 'ABB.NS', 'SCHNEIDER.NS', 'CESC.NS', 'TORNTPOWER.NS', 'CGPOWER.NS', 'INOXWIND.NS', `GVT&D.NS`]},
  { symbol: "NIFTY_CONSR_DURBL.NS", stocks: ['BATAINDIA.NS', 'BLUESTARCO.NS', 'AMBER.NS', 'WHIRLPOOL.NS', 'TITAN.NS', 'DIXON.NS', 'CENTURYPLY.NS', 'RAJESHEXPO.NS', 'KAJARIACER.NS', 'HAVELLS.NS', 'KALYANKJIL.NS', 'VOLTAS.NS', 'CROMPTON.NS', 'VGUARD.NS', 'CERA.NS']},
  { symbol: "NIFTY_HEALTHCARE.NS", stocks: ['MAXHEALTH.NS', 'GLENMARK.NS', 'IPCALAB.NS', 'GRANULES.NS', 'LAURUSLABS.NS', 'TORNTPHARM.NS', 'LUPIN.NS', 'APOLLOHOSP.NS', 'BIOCON.NS', 'ALKEM.NS', 'SUNPHARMA.NS', 'ABBOTINDIA.NS', 'DIVISLAB.NS', 'DRREDDY.NS', 'SYNGENE.NS', 'ZYDUSLIFE.NS', 'CIPLA.NS', 'AUROPHARMA.NS', 'LALPATHLAB.NS', 'METROPOLIS.NS']},
];

function Stocks() {
  const params = useParams();
  const name = params.name; // from /stocks/:name
  const navigate = useNavigate();

  const [signals, setSignals] = useState<{ [symbol: string]: AdxData }>({});

  const handleSignalUpdate = (symbol: string, data: AdxData) => {
    setSignals((prev) => ({ ...prev, [symbol]: data }));
  };

  // Find the sector whose symbol matches the name param
  const sector = stocks.find((s) => s.symbol === name);

  if (!sector) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-700">
          Sector not found.
        </h1>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Categorize the sector’s stocks
  const buyStocks = sector.stocks.filter((sym) => {
    const s = signals[sym];
    return s && s.adx > 25 && s.plusDI > 25;
  });

  const sellStocks = sector.stocks.filter((sym) => {
    const s = signals[sym];
    return s && s.adx > 25 && s.minusDI > 25;
  });

  const holdStocks = sector.stocks.filter((sym) => {
    const s = signals[sym];
    return (
      !s ||
      !(
        s.adx > 25 &&
        (s.plusDI > 25 || s.minusDI > 25)
      )
    );
  });

  const renderSection = (title: string, list: string[]) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
      {list.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {list.map((sym) => (
            <StockSignals
                  key={sym}
                  symbol={sym}
                  onSignalUpdate={handleSignalUpdate} name={sym} onClick={() => {}}            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No stocks in this category yet...</p>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {sector.symbol} Stocks
        </h1>
        <p className="text-gray-600">
          Real-time ADX-based signals for all {sector.symbol} stocks
        </p>
      </header>

      {renderSection("🟢 Buy", buyStocks)}
      {renderSection("🟡 Hold", holdStocks)}
      {renderSection("🔴 Sell", sellStocks)}
    </div>
  );
}

export default Stocks;
