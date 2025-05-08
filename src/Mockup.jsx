import React, { useState, useEffect } from 'react';
import './Mockup.css';
import logo from "./assets/image/logoAgrok.jpeg";
import './index.css'

export default function App() {
    const [currentApp, setCurrentApp] = useState('home');
    const [costsTab, setCostsTab] = useState('insumos');

    useEffect(() => {
        if (['custos', 'financeiro'].includes(currentApp)) {
            setTimeout(() => {
                document.querySelectorAll('.chart-bar').forEach(bar => {
                    const h = bar.getAttribute('data-height');
                    bar.style.height = `${h}px`;
                });
            }, 300);
        }
    }, [currentApp]);

    return (
        <div className="phone">
            <div className="notch" />
            <div className="phone-screen">
                {currentApp === 'home' ? (
                    <HomeScreen onOpen={setCurrentApp} />
                ) : (
                    <>
                        <BackButton onClick={() => setCurrentApp('home')} />
                        {currentApp === 'clima' && <ClimaApp />}
                        {currentApp === 'plantio' && <PlantioApp />}
                        {currentApp === 'custos' && <CustosApp tab={costsTab} setTab={setCostsTab} />}
                        {currentApp === 'financeiro' && <FinanceiroApp />}
                        {currentApp === 'maquinas' && <MaquinasApp />}
                        {currentApp === 'mercado' && <MercadoApp />}
                        <HomeButton onClick={() => setCurrentApp('home')} />
                    </>
                )}
            </div>
        </div>
    );
}

// Shared Controls
const BackButton = ({ onClick }) => (
    <div className="back-button" onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
        </svg>
    </div>
);

const HomeButton = ({ onClick }) => (
    <div className="home-button" onClick={onClick} />
);

// Home
function HomeScreen({ onOpen }) {
    const apps = [
        ['clima', '☁️', 'bg-blue-500', 'Clima'],
        ['plantio', '🌱', 'bg-green-600', 'Plantio'],
        ['custos', '💰', 'bg-red-600', 'Custos'],
        ['financeiro', '📊', 'bg-emerald-600', 'Financeiro'],
        ['maquinas', '🚜', 'bg-amber-600', 'Máquinas'],
        ['mercado', '📈', 'bg-purple-600', 'Mercado']
    ];
    const tasks = ['Verificar irrigação', 'Atualizar custos', 'Manutenção trator'];
    return (
        <>
        <a href="/">
        <img
                src={logo}
                alt="Logo AGROK"
                className="logo"
                onClick={() => setCurrentApp("home")}
            />
        </a>
            
            <div className="card bg-gradient-primary text-light">
                <h2>Olá, Produtor!</h2>
                <p className="text-center opacity-80">Bem-vindo ao seu assistente de gestão rural</p>
            </div>
            <div className="app-grid mb-4">
                {apps.map(([id, icon, color, label]) => (
                    <div key={id} onClick={() => onOpen(id)}>
                        <div className={`app-icon ${color}`}>{icon}</div>
                        <p className="app-name">{label}</p>
                    </div>
                ))}
            </div>
            <div className="card tasks">
                <h3>Tarefas de Hoje</h3>
                {tasks.map((t, i) => (<div key={i} className="task"><input type="checkbox" /><span>{t}</span></div>))}
            </div>
        </>
    );
}

// Clima
function ClimaApp() {
    const days = [
        ['Hoje', '28°C', '⛅', 'Parcialmente nublado'],
        ['Amanhã', '30°C', '☀️'],
        ['Quarta', '25°C', '🌧️'],
        ['Quinta', '24°C', '🌧️']
    ];
    return (
        <>
            <h2>Previsão do Tempo</h2>
            <div className="card bg-gradient-to-b from-blue-400 to-blue-600 text-light">
                <div className="flex justify-between items-center">
                    <div><p className="opacity-80">{days[0][0]}</p><p className="text-4xl font-bold">{days[0][1]}</p><p>{days[0][3]}</p></div>
                    <div className="text-6xl">{days[0][2]}</div>
                </div>
            </div>
            <div className="card">
                <h3>Próximos dias</h3>
                {days.slice(1).map(d => <div key={d[0]} className="flex justify-between items-center mb-2"><span>{d[0]}</span><div className="flex items-center"><span className="mr-2">{d[2]}</span><span>{d[1]}</span></div></div>)}
            </div>
            <div className="card">
                <h3>Alertas</h3>
                <p className="text-yellow-700">Possibilidade de chuvas fortes na quarta-feira. Verifique drenagem.</p>
            </div>
            <div className="card">
                <h3>Impacto na Produção</h3>
                <p>Condições favoráveis para soja nos próximos 5 dias.</p>
            </div>
        </>
    );
}

// Plantio
function PlantioApp() {
    const cultures = [['Milho', '15/02/2025', '🌽', 65, '30 dias'], ['Uva', '10/01/2025', '🍇', 40, '60 dias']];
    return (
        <>
            <h2>Gestão de Plantio</h2>
            <div className="card flex justify-between items-center mb-4"><h3>Culturas Ativas</h3><button className="btn">+ Adicionar</button></div>
            {cultures.map(c => <div key={c[0]} className="card mb-3"><div className="flex justify-between"><div><h4>{c[0]}</h4><p className="text-xs text-gray-500">Plantado: {c[1]}</p></div><div className="text-2xl">{c[2]}</div></div><div className="mt-2"><div className="w-full bg-tab-inactive rounded-full h-2.5 overflow-hidden"><div className="bg-green-600 h-full" style={{ width: `${c[3]}%` }} /></div><div className="flex justify-between text-xs mt-1"><span>Crescimento: {c[3]}%</span><span>Colheita: {c[4]}</span></div></div></div>)}
        </>
    );
}

// Custos
function CustosApp({ tab, setTab }) {
    const tabs = [['insumos', 'Insumos'], ['admin', 'Admin'], ['operacoes', 'Operações'], ['ativos', 'Ativos'], ['mao-obra', 'Mão de Obra']];
    const data = {
        insumos: [['Fertilizantes', '10/05/2025', 'R$ 45.200,00'], ['Defensivos', '05/05/2025', 'R$ 32.800,00'], ['Sementes', '20/04/2025', 'R$ 28.500,00']],
        admin: [['Contabilidade', null, 'R$ 3.500,00'], ['Impostos', null, 'R$ 12.800,00'], ['Seguros', null, 'R$ 8.200,00']],
        operacoes: [['Combustível', null, 'R$ 18.500,00'], ['Energia Elétrica', null, 'R$ 7.800,00'], ['Manutenção', null, 'R$ 12.200,00']],
        ativos: [['Depreciação de Máquinas', null, 'R$ 15.200,00'], ['Manutenção Infraestrutura', null, 'R$ 8.500,00'], ['Financiamento Equip.', null, 'R$ 22.800,00']],
        'mao-obra': [['Salários', null, 'R$ 32.500,00'], ['Encargos', null, 'R$ 18.200,00'], ['Terceirizados', null, 'R$ 15.800,00']]
    };
    return <>
        <h2>Gestão de Custos</h2>
        <div className="card"><div className="flex justify-between items-center"><h3>Custo Total</h3><select className="tab-button"><option>Maio 2025</option><option>Abril 2025</option></select></div><p className="text-3xl font-bold mt-2">R$ 125.450,00</p></div>
        <div className="tab-buttons">{tabs.map(t => <div key={t[0]} className={`tab-button ${tab === t[0] ? 'active' : ''}`} onClick={() => setTab(t[0])}>{t[1]}</div>)}</div>
        <div>
            {tabs.map(t => tab === t[0] && <div key={t[0]} className="tab-content active">
                {data[t[0]].map(item => <div key={item[0]} className="card flex justify-between items-center mb-2"><div><h4>{item[0]}</h4>{item[1] && <p className="text-xs text-gray-500">Últ: {item[1]}</p>}</div><span className="text-red-600">{item[2]}</span></div>)}
            </div>)}
        </div>
    </>;
}

// Financeiro
function FinanceiroApp() {
    const bars = [['em', 'Receitas', 150, 'bg-emerald-500'], ['de', 'Despesas', 100, 'bg-red-500'], ['em2', 'Receitas', 180, 'bg-emerald-500']];
    const history = [2020, 2021, 2022, 2023, 2024, 2025];
    const prices = [['Soja (saca)', 'R$ 168,50', [30, 25, 35, 20, 15, 25, 10], '#10b981'], ['Milho (saca)', 'R$ 72,30', [20, 25, 15, 30, 25, 20, 15], '#f59e0b']];
    return <>
        <h2>Gestão Financeira</h2>
        <div className="card bg-emerald-50"><h3>Rentabilidade</h3><p className="text-3xl font-bold mt-2">R$ 245.320,00</p><p className="text-emerald-600">↑ 12% vs ano ant.</p></div>
        <div className="card"><div className="flex justify-between items-center mb-2"><h3>Receitas vs Despesas</h3><select><option>Anual</option><option>Semestral</option><option>Trimestral</option></select></div><div className="chart-container">{bars.map((b, i) => <div key={i} className={`chart-bar ${b[3]}`} style={{ left: 60 + i * 60 + 'px' }} data-height={b[2]} />)}</div><div className="flex justify-around text-xs mt-2"><div className="flex items-center"><div className="w-3 h-3 bg-emerald-500 mr-1 rounded-full" />Receitas</div><div className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1 rounded-full" />Despesas</div></div></div>
        <div className="card"><h3>Histórico Rentabilidade</h3><div className="line-chart"><svg viewBox="0 0 300 100"><polyline fill="none" stroke="#10b981" strokeWidth="2" points="0,70 50,65 100,60 150,50 200,45 250,30 300,20" /></svg></div><div className="flex justify-between text-xs mt-2">{history.map(y => <span key={y}>{y}</span>)}</div></div>
        {prices.map(p => <div key={p[0]} className="card"><div className="flex justify-between items-center mb-2"><h4>{p[0]}</h4><span className="text-emerald-600">{p[1]}</span></div><div className="line-chart" style={{ height: '80px' }}><svg viewBox="0 0 300 50"><polyline fill="none" stroke={p[3]} strokeWidth="2" points={p[2].map((pt, i) => `${i * 50},${50 - pt}`).join(' ')} /></svg></div></div>)}
    </>;
}

// Máquinas
function MaquinasApp() {
    const eqs = [['Trator John Deere 6120', '10/05/2025', '🚜', '1.250h', 'Operacional', '#22c55e'], ['Colheitadeira New Holland', '25/04/2025', '🚜', '890h', 'Manutenção', '#eab308'], ['Irrigação', '05/05/2025', '💧', '15 ha', 'Operacional', '#22c55e']];
    const costs = [['Combustível', 'R$ 18.500,00'], ['Manutenção', 'R$ 12.200,00'], ['Depreciação', 'R$ 15.200,00']];
    const sched = [['Troca de óleo - Trator', '28/05/2025', '#ef4444'], ['Revisão - Colheitadeira', '05/06/2025', '#eab308']];
    return <>
        <h2>Gestão de Máquinas</h2>
        {eqs.map(e => <div key={e[0]} className="card mb-2"><div className="flex justify-between"><div><h4>{e[0]}</h4><p className="text-xs text-gray-500">Últ: {e[1]}</p></div><div className="text-2xl">{e[2]}</div></div><div className="flex justify-between text-xs mt-2"><span>Horas: {e[3]}</span><span style={{ color: e[5] }}>{e[4]}</span></div></div>)}
        <div className="card mb-2"><h3>Custos Ativos</h3>{costs.map(c => <div key={c[0]} className="flex justify-between text-sm py-1"><span>{c[0]}</span><span className="text-red-600">{c[1]}</span></div>)}<div className="flex justify-between text-sm font-medium pt-2 border-t mt-2"><span>Total</span><span className="text-red-600">R$ 45.900,00</span></div></div>
        <div className="card"><h3>Manutenções Programadas</h3>{sched.map(s => <div key={s[0]} className="flex items-center bg-gray-50 p-3 rounded-lg mb-2"><div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: s[2] }} /><div><p className="text-sm font-medium">{s[0]}</p><p className="text-xs text-gray-500">Agendado: {s[1]}</p></div></div>)}
        </div>
    </>;
}

// Mercado
function MercadoApp() {
    const sales = [['Uva', 'Buscando vendedores', 'R$ 5,55', '+0,8%', '#16a34a'], ['Milho', 'Vendido', 'R$ 6,15', '-0,3%', '#dc2626']];
    const forex = ['R$ 5,12', '-0,5%', '#dc2626'];
    const news = [['China aumenta importação...', 'Há 2 horas'], ['Clima adverso...', 'Há 5 horas'], ['Safra recorde...', 'Há 1 dia']];
    return <>
        <h2>Mercado Agrícola</h2>
        <div className="card mb-2"><div className="flex justify-between items-center mb-2"><h3>Vendas</h3><span className="text-xs text-gray-500">Atualizado: 12:15</span></div>{sales.map(s => <div key={s[0]} className="flex justify-between items-center py-1"><div className="flex items-center"><span className="text-xl mr-2">{s[0] === 'Uva' ? '🍇' : '🌽'}</span><div><h4>{s[0]}</h4><p className="text-xs" style={{ color: s[4] }}>{s[1]}</p></div></div><div className="text-right"><p className="font-medium">{s[2]}</p><p className="text-xs" style={{ color: s[4] }}>{s[3]}</p></div></div>)}
        </div>
        <div className="card mb-2"><h3>Cotação Cambial</h3><div className="flex justify-between items-center py-1"><div className="flex items-center"><span className="text-xl mr-2">💵</span><h4>Dólar</h4></div><div className="text-right"><p className="font-medium">{forex[0]}</p><p className="text-xs" style={{ color: forex[2] }}>{forex[1]}</p></div></div></div>
        <div className="card mb-2"><h3>CBOT Agrícola</h3><div className="line-chart"><svg viewBox="0 0 300 80"><polyline fill="none" stroke="#8b5cf6" strokeWidth="2" points="0,50 50,45 100,55 150,40 200,35 250,30 300,25" /></svg></div></div>
        <div className="card"><h3>Notícias</h3>{news.map(n => <div key={n[0]} className="mb-2"><h4 className="font-medium text-sm">{n[0]}</h4><p className="text-xs text-gray-500">{n[1]}</p></div>)}
        </div>
    </>;
}
