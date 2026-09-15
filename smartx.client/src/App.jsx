import { useState, useEffect } from 'react';
import {
    Activity, RadioReceiver, Map, Server, Settings, AlertTriangle,
    XCircle, UploadCloud, ChevronRight, Lock, ArrowLeft
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

const LandingPage = ({ onEnter }) => {
    return (
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
                    {/* Active Pillar */}
                    <div
                        onClick={onEnter}
                        className="group cursor-pointer bg-slate-900 border border-cyan-500/30 rounded-xl p-8 hover:bg-slate-800 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] flex flex-col items-center text-center transform hover:-translate-y-2"
                    >
                        <div className="bg-cyan-500/20 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
                            <RadioReceiver className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-3">Sensor Data Ingestion</h3>
                        <p className="text-sm text-slate-400 flex-grow">Real-time telemetry, spatial topology mapping, and anomaly detection.</p>
                        <div className="mt-6 flex items-center text-cyan-400 text-sm font-semibold">
                            Initialize Module <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Disabled Pillar 1 */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 opacity-60 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-slate-800 p-1.5 rounded-md">
                            <Lock className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="bg-slate-800 p-4 rounded-full mb-6">
                            <Server className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-3">Command Stream</h3>
                        <p className="text-sm text-slate-500 flex-grow">Bi-directional actuator control and historical command logs.</p>
                        <div className="mt-6 text-slate-600 text-sm font-semibold uppercase tracking-wider">
                            Coming in Part 2
                        </div>
                    </div>

                    {/* Disabled Pillar 2 */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 opacity-60 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-slate-800 p-1.5 rounded-md">
                            <Lock className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="bg-slate-800 p-4 rounded-full mb-6">
                            <Map className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-3">Mesh Routing</h3>
                        <p className="text-sm text-slate-500 flex-grow">Advanced network topology mapping and packet routing algorithms.</p>
                        <div className="mt-6 text-slate-600 text-sm font-semibold uppercase tracking-wider">
                            Coming in Part 3
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({ onBack }) => {
    const [nodes, setNodes] = useState(INITIAL_NODES);
    const [telemetryLog, setTelemetryLog] = useState([]);

    // Form & Validation State
    const [newDevice, setNewDevice] = useState({ id: '', mac: '', zone: ZONES[0], type: CATEGORIES[0] });
    const [uploadStatus, setUploadStatus] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Simulates the high-throughput telemetry data coming in
        const interval = setInterval(() => {
            setNodes(currentNodes => currentNodes.map(node => {
                if (node.status === 'offline') return node;

                const isSpike = Math.random() > 0.85;
                const drift = (Math.random() - 0.5) * 2;
                let newValue = node.value + drift;
                let newStatus = 'stable';

                if (node.type === 'Environmental') {
                    if (isSpike) newValue += 15;
                    if (newValue > 35) newStatus = 'critical';
                    else if (newValue > 30) newStatus = 'warning';
                } else if (node.type === 'Power Consumption') {
                    if (isSpike) newValue += 500;
                    if (newValue > 1600) newStatus = 'critical';
                }

                if (newStatus === 'critical' && node.status !== 'critical') {
                    setTelemetryLog(prev => [{
                        time: new Date().toLocaleTimeString(),
                        msg: `CRITICAL SPIKE: ${node.id} reported ${newValue.toFixed(1)}`,
                        type: 'error'
                    }, ...prev].slice(0, 10));
                }

                return { ...node, value: parseFloat(newValue.toFixed(1)), status: newStatus };
            }));
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!newDevice.id.trim()) newErrors.id = "Device ID is required.";
        else if (newDevice.id.length < 3) newErrors.id = "ID must be at least 3 characters.";

        // IEEE 802 MAC Address Format Validation
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (!newDevice.mac.trim()) newErrors.mac = "MAC Address is required.";
        else if (!macRegex.test(newDevice.mac)) newErrors.mac = "Invalid format (e.g. 00:1B:44:11:3A:B7).";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newNode = {
            ...newDevice,
            status: 'stable',
            value: newDevice.type === 'Power Consumption' ? 100 : 20,
            x: Math.floor(Math.random() * 80) + 10,
            y: Math.floor(Math.random() * 80) + 10
        };

        // 1. Optimistic UI Update
        setNodes([...nodes, newNode]);
        setTelemetryLog(prev => [{
            time: new Date().toLocaleTimeString(),
            msg: `SYSTEM: Registered new node ${newNode.id}`,
            type: 'info'
        }, ...prev].slice(0, 10));

        // 2. Async API Integration
        try {
            await fetch(`${API_BASE_URL}/api/telemetry/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    macAddress: newDevice.mac,
                    payloadValue: newNode.value
                })
            });
        } catch (err) {
            console.error("API Gateway unreachable:", err);
        }

        setNewDevice({ id: '', mac: '', zone: ZONES[0], type: CATEGORIES[0] });
        setUploadStatus(null);
        setErrors({});
    };

    const handleFileUpload = async (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];

            if (!newDevice.mac) {
                setUploadStatus('Enter MAC Address first!');
                return;
            }

            setUploadStatus('Encrypting & Uploading...');

            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch(`${API_BASE_URL}/api/telemetry/sensors/${encodeURIComponent(newDevice.mac)}/upload-log`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    setUploadStatus('Encrypted log attached!');
                } else {
                    setUploadStatus('Upload Failed');
                }
            } catch (err) {
                setUploadStatus('Network Error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
            {/* Top Navigation */}
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-cyan-400 flex items-center gap-2 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Menu
                    </button>
                    <div className="w-px h-6 bg-slate-800 mx-2"></div>
                    <Activity className="w-6 h-6 text-cyan-400" />
                    <h1 className="text-xl font-bold text-slate-100">Smart-X Console</h1>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> API Connected</span>
                    <span className="bg-slate-800 px-3 py-1 rounded-md text-slate-400">Admin Mode</span>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Registration Form */}
                <aside className="w-80 bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-100 mb-1 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-cyan-500" /> Node Registration
                        </h2>
                        <p className="text-xs text-slate-500 mb-4">Provision a new hardware device to the mesh.</p>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Device ID</label>
                                <input
                                    type="text"
                                    value={newDevice.id}
                                    onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value })}
                                    className={`w-full bg-slate-950 border ${errors.id ? 'border-rose-500' : 'border-slate-700'} rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500`}
                                    placeholder="e.g. ESP32-X1"
                                />
                                {errors.id && <span className="text-rose-500 text-[10px] mt-1 block">{errors.id}</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">MAC Address</label>
                                <input
                                    type="text"
                                    value={newDevice.mac}
                                    onChange={(e) => setNewDevice({ ...newDevice, mac: e.target.value })}
                                    className={`w-full bg-slate-950 border ${errors.mac ? 'border-rose-500' : 'border-slate-700'} rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono`}
                                    placeholder="00:00:00:00:00:00"
                                />
                                {errors.mac && <span className="text-rose-500 text-[10px] mt-1 block">{errors.mac}</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Deployment Zone</label>
                                <select
                                    value={newDevice.zone}
                                    onChange={(e) => setNewDevice({ ...newDevice, zone: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                                >
                                    {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Sensor Category</label>
                                <select
                                    value={newDevice.type}
                                    onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="pt-2 border-t border-slate-800">
                                <label className="block text-xs font-medium text-slate-400 mb-2">Attach Config/Log File</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className={`w-full border border-dashed rounded-md p-4 text-center transition-colors ${uploadStatus?.includes('✅') ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : uploadStatus?.includes('❌') || uploadStatus?.includes('⚠️') ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-400'}`}>
                                        {uploadStatus ? (
                                            <span className="text-xs font-medium">{uploadStatus}</span>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <UploadCloud className="w-5 h-5" />
                                                <span className="text-xs">Click to browse or drag file here</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded-md transition-colors shadow-lg shadow-cyan-500/20 text-sm mt-4">
                                Provision Node
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col p-6 overflow-hidden">

                    {/* Spatial Topology Map */}
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl mb-6 relative overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/80 z-10 flex justify-between items-center backdrop-blur-sm">
                            <div>
                                <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                                    <Map className="w-4 h-4 text-emerald-400" /> Interactive Spatial Topology
                                </h3>
                                <p className="text-xs text-slate-500">Visual anomaly detection via preattentive pulsing.</p>
                            </div>
                            <div className="flex gap-4 text-xs">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Stable</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Warning</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div> Critical</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-600"></div> Offline</span>
                            </div>
                        </div>

                        {/* Map Grid Canvas */}
                        <div className="flex-1 relative bg-slate-950 p-8">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                            {/* Nodes */}
                            {nodes.map((node, index) => (
                                <div
                                    key={`${node.id}-${index}`}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
                                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                >
                                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-colors duration-300
                    ${node.status === 'stable' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : ''}
                    ${node.status === 'warning' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : ''}
                    ${node.status === 'critical' ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse' : ''}
                    ${node.status === 'offline' ? 'bg-slate-700/50 border-slate-600 text-slate-500' : ''}
                  `}>
                                        {node.status === 'critical' ? <AlertTriangle className="w-4 h-4" /> :
                                            node.status === 'offline' ? <XCircle className="w-4 h-4" /> :
                                                <Activity className="w-4 h-4" />}
                                    </div>

                                    {/* Tooltip on Hover */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 border border-slate-700 rounded-md p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                        <div className="text-xs font-bold text-slate-200 border-b border-slate-700 pb-1 mb-1">{node.id}</div>
                                        <div className="text-[10px] text-slate-400 font-mono mb-2">{node.mac}</div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Zone:</span>
                                            <span className="text-slate-300">{node.zone}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Value:</span>
                                            <span className={`font-bold ${node.status === 'critical' ? 'text-rose-400' : 'text-cyan-400'}`}>
                                                {node.value} {node.type === 'Power Consumption' ? 'W' : '°C'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-semibold text-slate-400 whitespace-nowrap bg-slate-900/80 px-1 rounded">
                                        {node.id}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Telemetry Log Stream */}
                    <div className="h-48 bg-slate-900 border border-slate-800 rounded-xl flex flex-col">
                        <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <RadioReceiver className="w-4 h-4 text-cyan-500" /> Live Telemetry Stream
                            </h3>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2">
                            {telemetryLog.length === 0 && <div className="text-slate-600 italic">Waiting for incoming telemetry packets...</div>}
                            {telemetryLog.map((log, i) => (
                                <div key={i} className={`flex gap-3 py-1 border-b border-slate-800/50 ${log.type === 'error' ? 'text-rose-400 bg-rose-950/20 px-2 rounded -mx-2' :
                                        log.type === 'info' ? 'text-cyan-400' : 'text-slate-400'
                                    }`}>
                                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                                    <span>{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default function App() {
    const [started, setStarted] = useState(false);

    return (
        <>
            {!started ? (
                <LandingPage onEnter={() => setStarted(true)} />
            ) : (
                <Dashboard onBack={() => setStarted(false)} />
            )}
        </>
    );
}