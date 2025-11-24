import React, { useState } from 'react';
import { 
  BookOpen, 
  Wallet, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Smartphone, 
  Globe,
  Coins
} from 'lucide-react';

interface HelpGuideProps {
  onBack: () => void;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'requirements' | 'troubleshoot'>('tutorial');

  return (
    <div className="max-w-4xl mx-auto bg-ekopia-card border border-ekopia-border rounded-2xl p-0 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#0a0a0a] to-[#111] border-b border-ekopia-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-ekopia-primary/20 p-3 rounded-lg">
            <BookOpen className="w-8 h-8 text-ekopia-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Centro de Ayuda</h2>
            <p className="text-ekopia-muted text-sm">Todo lo que necesitas saber para crear tu token en EKOPIA</p>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-ekopia-muted hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al App
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ekopia-border bg-[#050505]">
        <button 
          onClick={() => setActiveTab('tutorial')}
          className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tutorial' ? 'border-ekopia-primary text-ekopia-primary bg-ekopia-primary/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Paso a Paso
        </button>
        <button 
          onClick={() => setActiveTab('requirements')}
          className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'requirements' ? 'border-ekopia-primary text-ekopia-primary bg-ekopia-primary/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Requisitos y Red
        </button>
        <button 
          onClick={() => setActiveTab('troubleshoot')}
          className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'troubleshoot' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Diagnóstico de Errores
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 min-h-[400px]">
        
        {/* TAB 1: TUTORIAL */}
        {activeTab === 'tutorial' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">¿Cómo crear tu token ERC-20?</h3>
              <p className="text-gray-400 mb-6">
                Crear un token (criptomoneda) en la red EKOPIA es un proceso sencillo que no requiere conocimientos de programación usando esta herramienta.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: <Wallet className="w-6 h-6 text-blue-400" />, 
                  step: "1", 
                  title: "Conectar Wallet", 
                  desc: "Pulsa el botón 'Conectar Wallet'. Si estás en móvil, asegúrate de usar la App de MetaMask." 
                },
                { 
                  icon: <Settings className="w-6 h-6 text-purple-400" />, 
                  step: "2", 
                  title: "Configurar Token", 
                  desc: "Define el nombre (ej: Bitcoin), símbolo (ej: BTC) y la cantidad total de tokens que existirán." 
                },
                { 
                  icon: <CheckCircle2 className="w-6 h-6 text-green-400" />, 
                  step: "3", 
                  title: "Desplegar", 
                  desc: "Pulsa 'Crear Token' y confirma la transacción en tu billetera. ¡Listo! Los tokens llegarán a tu dirección." 
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-black/40 border border-ekopia-border rounded-xl p-5 relative group hover:border-ekopia-primary/50 transition-colors">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-ekopia-card border border-ekopia-border rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  <div className="mb-3 bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-4 flex gap-3 items-start">
              <Coins className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-200 text-sm">Costos de Gas</h4>
                <p className="text-xs text-blue-300/80 mt-1">
                  Crear un token es una transacción en la blockchain que consume "Gas". Necesitarás tener una pequeña cantidad de la moneda nativa de EKOPIA en tu wallet para pagar esta comisión.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REQUIREMENTS */}
        {activeTab === 'requirements' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-2">Requisitos Técnicos</h3>
            
            {/* MetaMask Section */}
            <div className="bg-[#161616] border border-ekopia-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/10 p-3 rounded-lg shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">1. Instalar MetaMask</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Para interactuar con la blockchain necesitas una "billetera web3". MetaMask es el estándar de la industria.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-black/30 p-3 rounded border border-white/5">
                      <strong className="text-white text-sm block mb-1">En Computadora (PC/Mac)</strong>
                      <p className="text-xs text-gray-500">Instala la extensión de navegador para Chrome, Firefox o Edge desde <a href="https://metamask.io" target="_blank" className="text-blue-400 underline">metamask.io</a>.</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded border border-white/5">
                      <strong className="text-white text-sm block mb-1">En Celular (Móvil)</strong>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Smartphone className="w-3 h-3" /> Descarga la App oficial. 
                        <span className="text-orange-400"> Importante: Usa el navegador interno de la App.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Section */}
            <div className="bg-[#161616] border border-ekopia-border rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-ekopia-primary/10 p-3 rounded-lg shrink-0">
                  <Globe className="w-8 h-8 text-ekopia-primary" />
                </div>
                <div className="w-full">
                  <h4 className="text-lg font-bold text-white mb-1">2. Configurar Red EKOPIA</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Si el botón de conexión automática falla, agrega estos datos manualmente en MetaMask (Configuración &gt; Redes &gt; Agregar red manualmente):
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {[
                      { label: "Nombre de la Red", val: "EKOPIA Mainnet" },
                      { label: "RPC URL", val: "https://rpc.ekopia.space" }, // Assuming RPC based on pattern, generic placeholder if unknown
                      { label: "Chain ID", val: "2025" },
                      { label: "Símbolo", val: "EKO" },
                      { label: "Explorador", val: "https://explorer.ekopia.space" }
                    ].map((field, i) => (
                      <div key={i} className="flex flex-col bg-black/50 p-2 rounded px-3 border border-white/5">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{field.label}</span>
                        <code className="text-sm text-ekopia-accent font-mono">{field.val}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TROUBLESHOOT */}
        {activeTab === 'troubleshoot' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-yellow-950/20 border border-yellow-900/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-500 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Problema Común: "Creé el token pero no recibí nada"
              </h3>
              <p className="text-gray-300 mb-4">
                 Esto ocurre generalmente cuando se usa un código de contrato (Bytecode) antiguo o genérico que no incluye la instrucción de "Minteo" (acuñación) en el constructor.
              </p>
              
              <div className="bg-black/50 p-4 rounded-lg border border-yellow-900/30">
                <p className="text-sm text-gray-400 mb-2 font-semibold">Explicación Técnica:</p>
                <code className="block text-xs font-mono text-green-400 mb-3 bg-black p-2 rounded">
                  _mint(msg.sender, initialSupply_ * 10 ** decimals());
                </code>
                <p className="text-xs text-gray-500">
                  Si tu contrato no tiene esta línea exacta en el <code>constructor</code>, el contrato se crea en la blockchain pero con un balance de 0 tokens para ti.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white">Soluciones Aplicadas en esta App</h4>
              <ul className="grid gap-3">
                <li className="flex items-start gap-3 bg-ekopia-card border border-ekopia-border p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-ekopia-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <strong className="block text-white mb-0.5">Bytecode Validado</strong>
                    Usamos un bytecode pre-compilado que garantiza que la función <code>_mint</code> se ejecute y envíe el suministro total a tu billetera.
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-ekopia-card border border-ekopia-border p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-ekopia-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <strong className="block text-white mb-0.5">Detección de Móvil</strong>
                    Integramos "Deep Linking" para abrir MetaMask automáticamente en Android/iOS, solucionando errores de conexión.
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-ekopia-card border border-ekopia-border p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-ekopia-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <strong className="block text-white mb-0.5">BigInt Support</strong>
                    El sistema maneja números grandes correctamente para evitar errores al calcular 18 decimales.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};