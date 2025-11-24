import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, CheckCircle2, AlertCircle, Terminal, Layers, ArrowRight, BookOpen, Smartphone, Globe, MessageCircle, Twitter, Image as ImageIcon, Copy } from 'lucide-react';
import { ABI, DEFAULT_BYTECODE, SOLIDITY_SOURCE } from './constants';
import { DeployerCard } from './components/DeployerCard';
import { InfoPanel } from './components/InfoPanel';
import { HelpGuide } from './components/HelpGuide';

// Types
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

interface FeedbackState {
  type: 'success' | 'error' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface TokenMetadata {
  name: string;
  symbol: string;
  supply: string;
  logoUrl?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
}

export default function App() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
  });
  
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [deployedToken, setDeployedToken] = useState<{address: string, metadata: TokenMetadata} | null>(null);
  const [customBytecode, setCustomBytecode] = useState<string>(DEFAULT_BYTECODE);
  const [isDeploying, setIsDeploying] = useState(false);
  const [viewMode, setViewMode] = useState<'app' | 'guide'>('app');

  // Check if wallet is already connected on load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const network = await provider.getNetwork();
            setWallet({
              address: accounts[0].address,
              chainId: Number(network.chainId),
              isConnected: true,
            });
          }
        } catch (err) {
          console.error("Auto-connect failed", err);
        }
      }
    };
    checkConnection();
  }, []);

  // Connect Wallet Handler
  const connectWallet = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!window.ethereum) {
      if (isMobile) {
        const currentDomain = window.location.host + window.location.pathname;
        setFeedback({ 
          type: 'error', 
          message: "No se detectó la wallet. Si estás usando Chrome o Safari en tu móvil, la web no puede acceder a MetaMask directamente.",
          action: {
            label: "Abrir en App de MetaMask",
            onClick: () => {
              // Deep link to open current Dapp in MetaMask
              window.location.href = `https://metamask.app.link/dapp/${currentDomain}`;
            }
          }
        });
        return;
      }
      
      setFeedback({ type: 'error', message: "MetaMask no está instalado. Por favor instálalo en tu navegador." });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      
      setWallet({
        address: await signer.getAddress(),
        chainId: Number(network.chainId),
        isConnected: true,
      });
      setFeedback(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Error al conectar." });
    }
  };

  // Switch Chain Handler
  const switchToEkopia = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7E9' }], // 2025 in hex
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setWallet(prev => ({ ...prev, chainId: Number(network.chainId) }));
    } catch (err: any) {
      setFeedback({ type: 'error', message: "No se pudo cambiar a la red EKOPIA (Chain ID 2025). Agrégala manualmente a MetaMask." });
    }
  };

  // Deploy Handler
  const handleDeploy = async (metadata: TokenMetadata) => {
    if (!wallet.isConnected) {
      setFeedback({ type: 'error', message: "Conecta tu wallet primero." });
      return;
    }

    if (wallet.chainId !== 2025) {
        setFeedback({ type: 'info', message: "Advertencia: No estás en la red EKOPIA (2025)." });
    }

    setIsDeploying(true);
    setFeedback({ type: 'info', message: "Iniciando despliegue... Por favor confirma en tu wallet." });
    setDeployedToken(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      let finalBytecode = customBytecode.trim();
      if (!finalBytecode.startsWith('0x')) {
        finalBytecode = '0x' + finalBytecode;
      }

      if (finalBytecode.length < 100) {
        throw new Error("El Bytecode parece inválido o vacío.");
      }

      const factory = new ethers.ContractFactory(ABI, finalBytecode, signer);
      
      // Deploy contract
      const contract = await factory.deploy(metadata.name, metadata.symbol, metadata.supply);
      
      setFeedback({ type: 'info', message: "Transacción enviada. Esperando confirmación..." });
      
      await contract.waitForDeployment();
      const address = await contract.getAddress();

      setDeployedToken({
        address,
        metadata
      });
      setFeedback({ type: 'success', message: "¡Token desplegado exitosamente!" });
      
    } catch (err: any) {
      console.error(err);
      if (err.code === 'INVALID_ARGUMENT') {
        setFeedback({ type: 'error', message: "Error en los argumentos: Revisa que el Bytecode sea correcto y corresponda al ABI." });
      } else {
        setFeedback({ type: 'error', message: err.message || "Error desconocido al desplegar." });
      }
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-ekopia-dark font-sans text-ekopia-text selection:bg-ekopia-primary selection:text-white">
      
      {/* Header */}
      <header className="border-b border-ekopia-border bg-ekopia-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ekopia-primary to-purple-600 flex items-center justify-center shadow-lg shadow-ekopia-primary/20">
              <Layers className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              EKOPIA <span className="text-ekopia-primary">Forge</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setViewMode('app')}
              className={`text-sm font-medium transition-colors ${viewMode === 'app' ? 'text-white' : 'text-ekopia-muted hover:text-white'}`}
            >
              Deployer
            </button>
            <button 
              onClick={() => setViewMode('guide')}
              className={`text-sm font-medium transition-colors ${viewMode === 'guide' ? 'text-white' : 'text-ekopia-muted hover:text-white'}`}
            >
              Ayuda y Guía
            </button>
          </nav>

          <div>
             {!wallet.isConnected ? (
              <button 
                onClick={connectWallet}
                className="bg-ekopia-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" /> Conectar Wallet
              </button>
             ) : (
               <div className="flex items-center gap-3 bg-ekopia-card border border-ekopia-border px-4 py-2 rounded-lg">
                 <div className={`w-2.5 h-2.5 rounded-full ${wallet.chainId === 2025 ? 'bg-ekopia-accent animate-pulse' : 'bg-yellow-500'}`}></div>
                 <div className="flex flex-col">
                   <span className="text-xs text-ekopia-muted uppercase tracking-wider font-bold">
                     {wallet.chainId === 2025 ? 'EKOPIA Mainnet' : `Chain ID: ${wallet.chainId}`}
                   </span>
                   <span className="text-sm font-mono text-white">
                     {wallet.address?.substring(0, 6)}...{wallet.address?.slice(-4)}
                   </span>
                 </div>
                 {wallet.chainId !== 2025 && (
                    <button 
                      onClick={switchToEkopia}
                      className="ml-2 text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded hover:bg-yellow-500/20"
                    >
                      Cambiar Red
                    </button>
                 )}
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {viewMode === 'app' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Crear Token ERC-20</h2>
                <p className="text-ekopia-muted">
                  Despliega tu propio token en la blockchain EKOPIA. Los tokens se mintean automáticamente a tu wallet.
                </p>
              </div>

              <DeployerCard 
                onDeploy={handleDeploy} 
                isDeploying={isDeploying}
                isConnected={wallet.isConnected}
                customBytecode={customBytecode}
                setCustomBytecode={setCustomBytecode}
              />

              {/* Feedback Area */}
              {feedback && (
                <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                  feedback.type === 'error' 
                    ? 'bg-red-950/30 border-red-900 text-red-200' 
                    : feedback.type === 'success'
                    ? 'bg-green-950/30 border-green-900 text-green-200'
                    : 'bg-blue-950/30 border-blue-900 text-blue-200'
                }`}>
                  {feedback.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                  {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
                  {feedback.type === 'info' && <Terminal className="w-5 h-5 shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <p className="font-medium">{feedback.type === 'error' ? 'Error' : feedback.type === 'success' ? 'Éxito' : 'Estado'}</p>
                    <p className="text-sm opacity-90">{feedback.message}</p>
                    
                    {feedback.action && (
                      <button 
                        onClick={feedback.action.onClick}
                        className="mt-3 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors border border-white/10"
                      >
                         <Smartphone className="w-4 h-4" /> {feedback.action.label}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Success Result & Project Info */}
              {deployedToken && (
                <div className="space-y-6">
                  {/* Contract Address Card */}
                  <div className="bg-gradient-to-r from-ekopia-card to-[#1a1a1a] border border-ekopia-accent/50 rounded-xl p-6 shadow-[0_0_30px_rgba(0,255,98,0.1)]">
                    <h3 className="text-ekopia-accent font-bold text-lg mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6" /> Token Creado
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-ekopia-muted uppercase font-semibold">Dirección del Contrato</label>
                        <div className="flex items-center gap-3 mt-1">
                          <code className="bg-black/50 px-3 py-2 rounded text-ekopia-accent font-mono text-sm break-all select-all">
                            {deployedToken.address}
                          </code>
                          <a 
                            href={`https://explorer.ekopia.space/address/${deployedToken.address}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Ver en Explorador"
                          >
                            <ArrowRight className="w-4 h-4 text-white" />
                          </a>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">
                        Importa esta dirección en MetaMask para ver tus <b>{parseInt(deployedToken.metadata.supply).toLocaleString()} {deployedToken.metadata.symbol}</b>.
                      </p>
                    </div>
                  </div>

                  {/* Identity Guide Card */}
                  {(deployedToken.metadata.website || deployedToken.metadata.twitter || deployedToken.metadata.telegram || deployedToken.metadata.logoUrl) && (
                    <div className="bg-ekopia-card border border-ekopia-border rounded-xl p-6">
                       <h3 className="text-white font-bold text-md mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-400" /> Configuración de Identidad
                      </h3>
                      <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-lg mb-4 text-sm text-blue-200">
                        <p>
                          <b>Importante:</b> Los logos y redes sociales no se guardan en el contrato. 
                          Debes ir al <a href="https://explorer.ekopia.space" target="_blank" className="underline hover:text-white">Explorador de Bloques</a>, 
                          verificar tu contrato y buscar la opción "Update Token Info".
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Datos para copiar al Explorador:</p>
                        {deployedToken.metadata.logoUrl && (
                          <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-white/5">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="text-sm text-gray-300 truncate">{deployedToken.metadata.logoUrl}</span>
                            </div>
                            <button onClick={() => navigator.clipboard.writeText(deployedToken.metadata.logoUrl || '')} className="text-gray-500 hover:text-white"><Copy className="w-4 h-4" /></button>
                          </div>
                        )}
                        {deployedToken.metadata.website && (
                          <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-white/5">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="text-sm text-gray-300 truncate">{deployedToken.metadata.website}</span>
                            </div>
                            <button onClick={() => navigator.clipboard.writeText(deployedToken.metadata.website || '')} className="text-gray-500 hover:text-white"><Copy className="w-4 h-4" /></button>
                          </div>
                        )}
                        {deployedToken.metadata.twitter && (
                          <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-white/5">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <Twitter className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="text-sm text-gray-300 truncate">{deployedToken.metadata.twitter}</span>
                            </div>
                            <button onClick={() => navigator.clipboard.writeText(deployedToken.metadata.twitter || '')} className="text-gray-500 hover:text-white"><Copy className="w-4 h-4" /></button>
                          </div>
                        )}
                         {deployedToken.metadata.telegram && (
                          <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-white/5">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <MessageCircle className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="text-sm text-gray-300 truncate">{deployedToken.metadata.telegram}</span>
                            </div>
                            <button onClick={() => navigator.clipboard.writeText(deployedToken.metadata.telegram || '')} className="text-gray-500 hover:text-white"><Copy className="w-4 h-4" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Info & Contract Source */}
            <div className="lg:col-span-5 space-y-6">
              <InfoPanel title="Código Solidity del Contrato">
                <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-gray-400 overflow-x-auto border border-ekopia-border">
                  <pre>{SOLIDITY_SOURCE}</pre>
                </div>
                <p className="text-xs text-ekopia-muted mt-2">
                  Este es el código fuente que genera el Bytecode por defecto. Si usas un Bytecode diferente, asegúrate de que tenga constructor compatible.
                </p>
              </InfoPanel>

              <div className="bg-ekopia-card border border-ekopia-border rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-ekopia-primary" /> ¿Necesitas ayuda?
                </h3>
                <p className="text-sm text-ekopia-muted mb-4">
                  Si tienes dudas sobre cómo conectar MetaMask o por qué tu token anterior falló, consulta nuestra guía completa.
                </p>
                <button 
                  onClick={() => setViewMode('guide')}
                  className="text-sm text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors w-full border border-white/5"
                >
                  Ver Guía y Tutorial
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Guide View (New Component) */
          <HelpGuide onBack={() => setViewMode('app')} />
        )}
      </main>
    </div>
  );
}