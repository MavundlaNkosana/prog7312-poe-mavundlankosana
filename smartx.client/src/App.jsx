import { useState, useEffect } from 'react';
import {
    Activity, RadioReceiver, Map, Server, Settings, AlertTriangle,
    XCircle, UploadCloud, ChevronRight, Lock, ArrowLeft, Terminal, Undo2, Zap, Search, Filter, KeyRound, User
} from 'lucide-react';

const API_BASE_URL = 'https://localhost:32783'; 

const ZONES = ['Greenhouse Alpha', 'Greenhouse Beta', 'Pump Station 1', 'Utility Grid'];
const CATEGORIES = ['Environmental', 'Power Consumption', 'Actuator', 'Liquid Flow'];

const INITIAL_NODES = [
    { id: 'ESP32-A1', mac: '00:1B:44:11:3A:B7', zone: 'Greenhouse Alpha', type: 'Environmental', status: 'stable', value: 24.5, x: 20, y: 30 },
    { id: 'ESP32-A2', mac: '00:1B:44:11:3A:C2', zone: 'Greenhouse Alpha', type: 'Environmental', status: 'stable', value: 25.1, x: 40, y: 30 },
    { id: 'ESP32-B1', mac: '00:1B:44:11:3A:99', zone: 'Greenhouse Beta', type: 'Environmental', status: 'stable', value: 22.0, x: 70, y: 50 },
    { id: 'PWR-01', mac: '00:1B:44:11:3B:01', zone: 'Utility Grid', type: 'Power Consumption', status: 'stable', value: 1200, x: 80, y: 80 },
    { id: 'PUMP-A', mac: '00:1B:44:11:3C:44', zone: 'Pump Station 1', type: 'Actuator', status: 'offline', value: 0, x: 20, y: 70 },
];

const LoginPage = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // Dynamically choose endpoint based on state
        const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (isRegistering) {
                    setSuccessMsg('Registration successful! You can now authenticate.');
                    setIsRegistering(false);
                    setPassword(''); // Clear password for security
                } else {
                    // Save secure token to local storage
                    localStorage.setItem('smartx_token', data.token);
                    onLogin();
                }
            } else {
                setError(data.message || 'Authentication failed.');
            }
        } catch (err) {
            setError('Network error. Ensure the C# API is running.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-8 font-sans">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <Activity className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-slate-100">Smart-X Gateway</h2>
                    <p className="text-slate-400 text-sm mt-2">{isRegistering ? 'Register a new Operator ID' : 'Sign in to access telemetry controls'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Operator ID</label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                                placeholder="Enter your ID"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Passcode</label>
                        <div className="relative">
                            <KeyRound className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="text-rose-400 text-xs text-center bg-rose-500/10 py-2 rounded border border-rose-500/20">{error}</div>}
                    {successMsg && <div className="text-emerald-400 text-xs text-center bg-emerald-500/10 py-2 rounded border border-emerald-500/20">{successMsg}</div>}

                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2 shadow-lg shadow-cyan-500/20">
                        {isRegistering ? 'Register Operator' : 'Authenticate Session'}
                    </button>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }}
                            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                        >
                            {isRegistering ? 'Already have an ID? Authenticate here.' : 'Need access? Register a new ID.'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const LandingPage = ({ onNavigate }) => (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-8 font-sans">
        <div className="max-w-4xl w-full">
            <div className="text-center mb-16">
                <Activity className="w-20 h-20 text-cyan-500 mx-auto mb-6 animate-pulse" />
                <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-4">
                    Smart-X Ecosystem
                </h1>
                <p className="text-xl text-slate-400">Advanced IoT Mesh Telemetry & Gateway Management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Module 1: Ingestion */}
                <div onClick={() => onNavigate('ingestion')} className="group cursor-pointer bg-slate-900 border border-cyan-500/30 rounded-xl p-8 hover:bg-slate-800 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col items-center text-center transform hover:-translate-y-2">
                    <div className="bg-cyan-500/20 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <RadioReceiver className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">Sensor Data Ingestion</h3>
                    <p className="text-sm text-slate-400 flex-grow">Real-time telemetry, spatial topology mapping, and anomaly detection.</p>
                    <div className="mt-6 flex items-center text-cyan-400 text-sm font-semibold">
                        Open Module <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </div>

                {/* Module 2: Command Stream (NEW) */}
                <div onClick={() => onNavigate('command')} className="group cursor-pointer bg-slate-900 border border-purple-500/30 rounded-xl p-8 hover:bg-slate-800 hover:border-purple-400 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.1)] flex flex-col items-center text-center transform hover:-translate-y-2">
                    <div className="bg-purple-500/20 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <Server className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">Command Stream</h3>
                    <p className="text-sm text-slate-400 flex-grow">Bi-directional actuator control, predictive insights, and command history.</p>
                    <div className="mt-6 flex items-center text-purple-400 text-sm font-semibold">
                        Open Module <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </div>

                {/* Module 3: Locked */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 opacity-60 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-slate-800 p-1.5 rounded-md"><Lock className="w-4 h-4 text-slate-500" /></div>
                    <div className="bg-slate-800 p-4 rounded-full mb-6"><Map className="w-10 h-10 text-slate-500" /></div>
                    <h3 className="text-xl font-bold text-slate-300 mb-3">Mesh Routing</h3>
                    <p className="text-sm text-slate-500 flex-grow">Advanced network topology mapping and packet routing algorithms.</p>
                    <div className="mt-6 text-slate-600 text-sm font-semibold uppercase tracking-wider">Coming in Part 3</div>
                </div>
            </div>
        </div>
    </div>
);

const IngestionDashboard = ({ nodes, telemetryLog, onRegister, newDevice, setNewDevice }) => {
    const [uploadStatus, setUploadStatus] = useState(null);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!newDevice.id.trim()) newErrors.id = "Device ID required.";
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (!newDevice.mac.trim() || !macRegex.test(newDevice.mac)) newErrors.mac = "Invalid MAC.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (validateForm()) onRegister();
    };

    const handleFileUpload = async (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!newDevice.mac) { setUploadStatus('⚠️ Enter MAC Address first!'); return; }
            setUploadStatus('Encrypting & Uploading...');
            const formData = new FormData();
            formData.append("file", file);
            try {
                const response = await fetch(`${API_BASE_URL}/api/telemetry/sensors/${encodeURIComponent(newDevice.mac)}/upload-log`, { method: 'POST', body: formData });
                setUploadStatus(response.ok ? '✅ Encrypted log attached!' : '❌ API Upload Failed');
            } catch (err) { setUploadStatus('❌ Network Error'); }
        }
    };

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <aside className="w-80 bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
                <div>
                    <h2 className="text-lg font-semibold text-slate-100 mb-1 flex items-center gap-2"><Settings className="w-5 h-5 text-cyan-500" /> Node Registration</h2>
                    <form onSubmit={handleRegister} className="space-y-4 mt-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Device ID</label>
                            <input type="text" value={newDevice.id} onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value })} className={`w-full bg-slate-950 border ${errors.id ? 'border-rose-500' : 'border-slate-700'} rounded-md px-3 py-2 text-sm text-slate-200`} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">MAC Address</label>
                            <input type="text" value={newDevice.mac} onChange={(e) => setNewDevice({ ...newDevice, mac: e.target.value })} className={`w-full bg-slate-950 border ${errors.mac ? 'border-rose-500' : 'border-slate-700'} rounded-md px-3 py-2 text-sm text-slate-200 font-mono`} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Deployment Zone</label>
                            <select value={newDevice.zone} onChange={(e) => setNewDevice({ ...newDevice, zone: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200">
                                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                        <div className="pt-2 border-t border-slate-800">
                            <label className="block text-xs font-medium text-slate-400 mb-2">Attach Config/Log File</label>
                            <div className="relative">
                                <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <div className={`w-full border border-dashed rounded-md p-4 text-center ${uploadStatus?.includes('✅') ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-700 bg-slate-950'}`}>
                                    {uploadStatus ? <span className="text-xs">{uploadStatus}</span> : <div className="flex flex-col items-center"><UploadCloud className="w-5 h-5" /><span className="text-xs">Browse file</span></div>}
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded-md text-sm mt-4">Provision Node</button>
                    </form>
                </div>
            </aside>

            {/* Main Map */}
            <main className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl mb-6 relative overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/80 z-10 flex justify-between items-center backdrop-blur-sm">
                        <h3 className="font-semibold text-slate-100 flex items-center gap-2"><Map className="w-4 h-4 text-emerald-400" /> Spatial Topology</h3>
                    </div>
                    <div className="flex-1 relative bg-slate-950 p-8">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                        {nodes.map((node, index) => (
                            <div key={`${node.id}-${index}`} className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-colors duration-300
                  ${node.status === 'stable' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : ''}
                  ${node.status === 'warning' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : ''}
                  ${node.status === 'critical' ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse' : ''}
                  ${node.status === 'offline' ? 'bg-slate-700/50 border-slate-600 text-slate-500' : ''}
                `}>
                                    {node.status === 'critical' ? <AlertTriangle className="w-4 h-4" /> : node.status === 'offline' ? <XCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-semibold text-slate-400 whitespace-nowrap bg-slate-900/80 px-1 rounded">{node.id}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

const CommandStream = ({ nodes, updateNodeStatus }) => {
    const [search, setSearch] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [insights, setInsights] = useState([]);

    // Fetch predictive insights from API
    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/command/insights`);
                if (res.ok) setInsights(await res.json());
            } catch (err) {
                // Fallback demo insights if API disconnected
                setInsights(["Pattern detected: Pump Station 1 frequently fails after Utility Grid spikes > 1500W. Recommend pre-emptive throttle."]);
            }
        };
        fetchInsights();
    }, [commandHistory]);

    const issueCommand = async (mac, action) => {
        try {
            await fetch(`${API_BASE_URL}/api/command/issue`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ macAddress: mac, command: action })
            });
            // UI Optimistic update (Stack tracking)
            const record = { id: Date.now(), mac, action, time: new Date().toLocaleTimeString() };
            setCommandHistory(prev => [record, ...prev]);
            updateNodeStatus(mac, action === 'SHUTDOWN' ? 'offline' : 'stable');
        } catch (e) { console.error(e); }
    };

    const undoLastCommand = async () => {
        if (commandHistory.length === 0) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/command/undo`, { method: 'POST' });
            if (res.ok) {
                const lastCmd = commandHistory[0];
                setCommandHistory(prev => prev.slice(1));
                updateNodeStatus(lastCmd.mac, 'stable'); // Reset status
            }
        } catch (e) { console.error(e); }
    };

    const filteredNodes = nodes.filter(n => n.id.toLowerCase().includes(search.toLowerCase()) || n.type.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* Left - Operations & Search */}
            <aside className="w-[450px] bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
                <div>
                    <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2"><Terminal className="w-5 h-5 text-purple-500" /> Active Devices</h2>
                    <div className="relative mb-6">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <input type="text" placeholder="Filter by ID or Category..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-md pl-9 pr-3 py-2 text-sm text-slate-200" />
                    </div>
                    <div className="space-y-3">
                        {filteredNodes.map(node => (
                            <div key={node.id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-slate-200 text-sm">{node.id} <span className="text-xs font-normal text-slate-500 ml-2">{node.type}</span></div>
                                    <div className={`text-xs mt-1 ${node.status === 'critical' ? 'text-rose-400' : 'text-emerald-400'}`}>Current Value: {node.value}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => issueCommand(node.mac, 'TOGGLE')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs rounded border border-slate-700">Toggle</button>
                                    <button onClick={() => issueCommand(node.mac, 'SHUTDOWN')} className="px-3 py-1 bg-rose-950 hover:bg-rose-900 text-rose-400 text-xs rounded border border-rose-900">Kill</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Right - Insights & History Stack */}
            <main className="flex-1 flex flex-col p-6 gap-6 bg-slate-950">

                {/* Predictive Engine Panel */}
                <div className="bg-purple-950/20 border border-purple-900/50 rounded-xl p-5">
                    <h3 className="font-semibold text-purple-400 flex items-center gap-2 mb-3"><Zap className="w-5 h-5" /> Automated Insights & Predictive Engine</h3>
                    <div className="space-y-2">
                        {insights.map((insight, i) => (
                            <div key={i} className="bg-slate-900 border border-purple-800/30 p-3 rounded text-sm text-slate-300">
                                {insight}
                            </div>
                        ))}
                        {insights.length === 0 && <div className="text-slate-500 text-sm">Analyzing mesh topology for actionable patterns...</div>}
                    </div>
                </div>

                {/* Command History Stack */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                        <h3 className="font-semibold text-slate-100 flex items-center gap-2">Command History Stack (LIFO)</h3>
                        <button onClick={undoLastCommand} disabled={commandHistory.length === 0} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs rounded-md transition-colors">
                            <Undo2 className="w-4 h-4" /> Undo Last Action
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto space-y-2">
                        {commandHistory.map((cmd, i) => (
                            <div key={cmd.id} className="flex justify-between items-center bg-slate-950 border border-slate-800 p-3 rounded">
                                <span className="text-slate-400 text-xs">[{cmd.time}]</span>
                                <span className="text-slate-200 text-sm font-mono">EXEC: {cmd.action} ➔ {cmd.mac}</span>
                                <span className="text-xs px-2 py-1 bg-emerald-950 text-emerald-400 rounded">SUCCESS</span>
                            </div>
                        ))}
                        {commandHistory.length === 0 && <div className="text-slate-600 italic text-sm text-center mt-4">Stack is empty. No recent commands.</div>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState('landing'); // 'landing', 'ingestion', 'command'

    // LIFING STATE: By holding nodes and logs here, switching tabs preserves the data perfectly.
    const [nodes, setNodes] = useState(INITIAL_NODES);
    const [telemetryLog, setTelemetryLog] = useState([]);
    const [newDevice, setNewDevice] = useState({ id: '', mac: '', zone: ZONES[0], type: CATEGORIES[0] });

    // High-throughput simulated ingestion
    useEffect(() => {
        if (currentView === 'landing') return;

        const interval = setInterval(() => {
            setNodes(currentNodes => currentNodes.map(node => {
                if (node.status === 'offline') return node;
                const isSpike = Math.random() > 0.85;
                let newValue = node.value + (Math.random() - 0.5) * 2;
                let newStatus = 'stable';

                if (node.type === 'Environmental') {
                    if (isSpike) newValue += 15;
                    if (newValue > 35) newStatus = 'critical';
                } else if (node.type === 'Power Consumption') {
                    if (isSpike) newValue += 500;
                    if (newValue > 1600) newStatus = 'critical';
                }

                if (newStatus === 'critical' && node.status !== 'critical') {
                    setTelemetryLog(prev => [{ time: new Date().toLocaleTimeString(), msg: `CRITICAL SPIKE: ${node.id} reported ${newValue.toFixed(1)}`, type: 'error' }, ...prev].slice(0, 10));
                }
                return { ...node, value: parseFloat(newValue.toFixed(1)), status: newStatus };
            }));
        }, 2500);

        return () => clearInterval(interval);
    }, [currentView]);

    const registerNode = async () => {
        const newNode = { ...newDevice, status: 'stable', value: 20, x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 80) + 10 };
        setNodes([...nodes, newNode]);
        setTelemetryLog(prev => [{ time: new Date().toLocaleTimeString(), msg: `SYSTEM: Registered new node ${newNode.id}`, type: 'info' }, ...prev].slice(0, 10));
        setNewDevice({ id: '', mac: '', zone: ZONES[0], type: CATEGORIES[0] });

        // API Push
        fetch(`${API_BASE_URL}/api/telemetry/ingest`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ macAddress: newDevice.mac, payloadValue: 20 })
        }).catch(e => console.error("Ingest failed", e));
    };

    const updateNodeStatus = (mac, newStatus) => {
        setNodes(current => current.map(n => n.mac === mac ? { ...n, status: newStatus } : n));
    };

    if (!isAuthenticated) return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    if (currentView === 'landing') return <LandingPage onNavigate={setCurrentView} />;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentView('landing')} className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-cyan-400 flex items-center gap-2 text-sm font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Menu
                    </button>
                    <div className="w-px h-6 bg-slate-800 mx-2"></div>
                    {currentView === 'ingestion' ? <Activity className="w-6 h-6 text-cyan-400" /> : <Server className="w-6 h-6 text-purple-400" />}
                    <h1 className="text-xl font-bold text-slate-100">
                        {currentView === 'ingestion' ? 'Smart-X Console' : 'Command Stream Engine'}
                    </h1>
                </div>

                {/* Module Navigation Tabs */}
                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                    <button onClick={() => setCurrentView('ingestion')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'ingestion' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}>Ingestion</button>
                    <button onClick={() => setCurrentView('command')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentView === 'command' ? 'bg-slate-800 text-purple-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}>Command</button>
                </div>
            </header>

            {currentView === 'ingestion' ? (
                <IngestionDashboard nodes={nodes} telemetryLog={telemetryLog} newDevice={newDevice} setNewDevice={setNewDevice} onRegister={registerNode} />
            ) : (
                <CommandStream nodes={nodes} updateNodeStatus={updateNodeStatus} />
            )}
        </div>
    );
}