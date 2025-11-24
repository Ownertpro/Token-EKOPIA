import React, { useState } from 'react';
import { Rocket, Settings, AlertTriangle, Globe, Image as ImageIcon, Twitter, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface DeployerCardProps {
  onDeploy: (metadata: any) => void;
  isDeploying: boolean;
  isConnected: boolean;
  customBytecode: string;
  setCustomBytecode: (val: string) => void;
}

export const DeployerCard: React.FC<DeployerCardProps> = ({ 
  onDeploy, 
  isDeploying, 
  isConnected,
  customBytecode,
  setCustomBytecode
}) => {
  const [name, setName] = useState('Mi EKOPIA Token');
  const [symbol, setSymbol] = useState('MEKO');
  const [supply, setSupply] = useState('1000000');
  
  // Optional Metadata (Off-chain)
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const handleSubmit = () => {
    onDeploy({
      name,
      symbol,
      supply,
      logoUrl,
      website,
      twitter,
      telegram
    });
  };

  return (
    <div className="bg-ekopia-card border border-ekopia-border rounded-xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-ekopia-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="space-y-5 relative z-10">
        
        {/* Core Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nombre del Token</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-ekopia-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-ekopia-primary focus:border-transparent outline-none transition-all placeholder-gray-600"
              placeholder="Ej: Bitcoin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Símbolo</label>
            <input 
              type="text" 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-black/40 border border-ekopia-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-ekopia-primary focus:border-transparent outline-none transition-all placeholder-gray-600"
              placeholder="Ej: BTC"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Supply Inicial</label>
          <div className="relative">
             <input 
              type="number" 
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              className="w-full bg-black/40 border border-ekopia-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-ekopia-primary focus:border-transparent outline-none transition-all placeholder-gray-600"
              placeholder="1000000"
            />
            <span className="absolute right-4 top-3.5 text-xs text-ekopia-muted font-mono">TOKENS</span>
          </div>
          <p className="text-xs text-gray-500">
            Se aplicarán 18 decimales automáticamente. (1 = 1.000000000000000000)
          </p>
        </div>

        {/* Optional Metadata Section */}
        <div className="border-t border-ekopia-border pt-4">
           <button 
                onClick={() => setShowMetadata(!showMetadata)}
                className="w-full flex items-center justify-between text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-ekopia-primary" />
                  Identidad del Proyecto (Web, Logo, Social)
                </div>
                {showMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showMetadata && (
              <div className="mt-4 space-y-4 animate-fadeIn">
                <div className="bg-blue-900/10 border border-blue-900/30 p-3 rounded text-xs text-blue-200 mb-2">
                  Nota: Estos datos <b>no se guardan en el contrato</b>. Se te facilitarán al final para que los registres en el Explorador de Bloques (Etherscan/Ekopia).
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> URL del Logo (PNG/JPG)</label>
                    <input 
                      type="text" 
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full bg-black/40 border border-ekopia-border rounded px-3 py-2 text-sm text-white focus:border-ekopia-primary outline-none"
                      placeholder="https://miweb.com/logo.png"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1"><Globe className="w-3 h-3"/> Sitio Web</label>
                    <input 
                      type="text" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-black/40 border border-ekopia-border rounded px-3 py-2 text-sm text-white focus:border-ekopia-primary outline-none"
                      placeholder="https://miweb.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1"><Twitter className="w-3 h-3"/> Twitter / X</label>
                    <input 
                      type="text" 
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="w-full bg-black/40 border border-ekopia-border rounded px-3 py-2 text-sm text-white focus:border-ekopia-primary outline-none"
                      placeholder="https://x.com/proyecto"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1"><MessageCircle className="w-3 h-3"/> Telegram</label>
                    <input 
                      type="text" 
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="w-full bg-black/40 border border-ekopia-border rounded px-3 py-2 text-sm text-white focus:border-ekopia-primary outline-none"
                      placeholder="https://t.me/comunidad"
                    />
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Advanced Settings Toggle */}
        <div className="pt-2 border-t border-ekopia-border">
            <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs text-ekopia-muted hover:text-white transition-colors"
            >
                <Settings className="w-3 h-3" /> 
                {showAdvanced ? 'Ocultar Configuración Técnica (Bytecode)' : 'Configuración Técnica (Bytecode)'}
            </button>
            
            {showAdvanced && (
                <div className="mt-4 space-y-2 bg-black/20 p-4 rounded-lg border border-yellow-900/30">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Zona de Peligro</span>
                    </div>
                    <label className="text-xs text-gray-400 block">
                        Si el creador no recibe tokens, pega aquí el <code>bytecode</code> compilado de un contrato que contenga <code>_mint</code> en el constructor.
                    </label>
                    <textarea 
                        value={customBytecode}
                        onChange={(e) => setCustomBytecode(e.target.value)}
                        className="w-full h-32 bg-black/80 border border-ekopia-border rounded text-xs font-mono text-green-500 p-2 focus:outline-none focus:border-yellow-500/50"
                        placeholder="0x608060..."
                    />
                </div>
            )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={isDeploying || !isConnected}
          className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${
            !isConnected 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : isDeploying
              ? 'bg-ekopia-primary/50 text-white cursor-wait'
              : 'bg-gradient-to-r from-ekopia-primary to-blue-600 hover:to-blue-500 text-white shadow-lg shadow-blue-900/30'
          }`}
        >
          {isDeploying ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Desplegando...
            </>
          ) : !isConnected ? (
            "Conecta Wallet para Iniciar"
          ) : (
            <>
              <Rocket className="w-5 h-5" /> Crear Token
            </>
          )}
        </button>

      </div>
    </div>
  );
};