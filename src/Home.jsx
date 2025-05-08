import React from 'react';
import './Home.css';
import logoImg from "./assets/image/logoAgrok.jpeg";
import { Link } from "react-router-dom";

export default function AgrokLanding() {
    return (
        <div className="agrok-container">
            <div className="agrok-header">
                <img
                    src={logoImg} alt="Logo AGROK" className="agrok-logo"></img>
                <h1>Bem-vindo à AGROK</h1>
                <p className="agrok-description">
                    Gestão simples e eficiente para produtores orgânicos. Controle sua
                    produção, vendas e estoque sem complicações.
                </p>
            </div>

            <div className="agrok-features">
                <div className="feature">
                    <Link to="/Mockup">
                        <div className="feature-icon">🌱</div>
                        <div className="feature-title">Mockup - Preview</div>
                    </Link>

                    <div className="feature-desc">
                        Um preview do nosso mockup, do app mobile.
                    </div>
                </div>

                <div className="feature">
                    <Link to="/Estatistica">
                        <div className="feature-icon">📊</div>
                        <div className="feature-title">Relatórios Simples</div>
                    </Link>
                    <div className="feature-desc">
                        Entenda seus lucros, perdas rapidamente.
                    </div>
                </div>
            </div>
        </div>
    );
}