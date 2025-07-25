import { useState } from "react";

const networks = {
  ethereum: {
    name: "Ethereum Mainnet",
    icon: "/assets/icons/eth.svg"
  },
  polygon: {
    name: "Polygon",
    icon: "/assets/icons/polygon.svg"
  },
  bsc: {
    name: "Binance Smart Chain",
    icon: "/assets/icons/bsc.svg"
  },
  arbitrum: {
    name: "Arbitrum",
    icon: "/assets/icons/arbitrum.svg"
  },
  optimism: {
    name: "Optimism",
    icon: "/assets/icons/op.svg"
  },
  base: {
    name: "Base",
    icon: "/assets/icons/base.svg"
  }
};

export default function NetworkSelect({ chain, setChain }) {
  const [open, setOpen] = useState(false);
  const selected = networks[chain];

  return (
    <div className="relative w-full">
      <label className="block text-sm font-semibold text-gray-300 mb-3 sm:mb-4 transition-colors duration-300 hover:text-white">
        Blockchain Network
      </label>

      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-left text-white text-base sm:text-lg backdrop-blur-xl hover:border-gray-600/50 hover:shadow-lg transition-all"
      >
        <div className="flex items-center gap-3">
          <img src={selected.icon} alt={selected.name} className="w-6 h-6" />
          {selected.name}
        </div>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-gray-900/90 backdrop-blur border border-gray-700/50 rounded-xl shadow-xl">
          {Object.entries(networks).map(([key, net]) => (
            <button
              key={key}
              onClick={() => {
                setChain(key);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 text-white"
            >
              <img src={net.icon} alt={net.name} className="w-5 h-5" />
              {net.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
