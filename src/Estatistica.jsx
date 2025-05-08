import React, { useState, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { Html5Qrcode } from "html5-qrcode";
import "./Estatistica.css";
import { Link } from "react-router-dom";
import logo from "./assets/image/logoAgrok.jpeg";

const AGROK_RAZAO = "AGROK SOLUÇÕES AGRÍCOLAS LTDA";

export default function Estatistica() {
  const [produtos, setProdutos] = useState([]);
  const [tipoXML, setTipoXML] = useState("");
  const [otherParty, setOtherParty] = useState({});
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [historico, setHistorico] = useState([]);

  const dropRef = useRef(null);
  const qrRef = useRef(null);

  function parseParty(el) {
    const cnpjEl = el.querySelector("CNPJ");
    if (cnpjEl) {
      return {
        tipo: "empresa",
        cnpj: cnpjEl.textContent,
        razaoSocial: el.querySelector("RazaoSocial")?.textContent || ""
      };
    }
    return {
      tipo: "pessoa",
      cpf: el.querySelector("CPF")?.textContent || "",
      nome: el.querySelector("Nome")?.textContent || ""
    };
  }

  const parseXML = (xmlString) => {
    const xmlDoc = new DOMParser().parseFromString(xmlString, "application/xml");
    const nota = xmlDoc.querySelector("NotaFiscal");
    if (!nota) return;

    const emitEl = nota.querySelector("Emitente");
    const destEl = nota.querySelector("Destinatario");
    const razaoEmit = emitEl.querySelector("RazaoSocial")?.textContent;
    const razaoDest = destEl.querySelector("RazaoSocial")?.textContent;

    if (razaoEmit === AGROK_RAZAO) {
      handleVenda(nota, destEl);
    } else if (razaoDest === AGROK_RAZAO) {
      handleCompra(nota, emitEl);
    }
  };

  const handleCompra = (nota, emitEl) => {
    setTipoXML("compra");
    setOtherParty(parseParty(emitEl));

    const dados = Array.from(nota.querySelectorAll("Produto")).map(p => ({
      descricao: p.querySelector("Descricao").textContent,
      quantidade: parseFloat(p.querySelector("Quantidade").textContent),
      valorTotal: parseFloat(p.querySelector("ValorTotal").textContent)
    }));
    setProdutos(dados);

    const valCompras = parseFloat(
      nota.querySelector("ValorCompras")?.textContent
      ?? nota.querySelector("Total > ValorNota").textContent
    );

    // Atualiza receita e histórico em chamadas separadas
    setReceitaTotal(prev => prev - valCompras);
    setHistorico(prev => [
      ...prev,
      { leitura: prev.length + 1, tipo: "compra", valor: -valCompras }
    ]);
  };

  const handleVenda = (nota, destEl) => {
    setTipoXML("venda");
    setOtherParty(parseParty(destEl));

    const dados = Array.from(nota.querySelectorAll("Produto")).map(p => ({
      descricao: p.querySelector("Descricao").textContent,
      quantidade: parseFloat(p.querySelector("Quantidade").textContent),
      valorTotal: parseFloat(p.querySelector("ValorTotal").textContent)
    }));
    setProdutos(dados);

    const valVenda = parseFloat(nota.querySelector("Total > ValorNota").textContent);

    setReceitaTotal(prev => prev + valVenda);
    setHistorico(prev => [
      ...prev,
      { leitura: prev.length + 1, tipo: "venda", valor: valVenda }
    ]);
  };

  const handleFile = file => {
    const reader = new FileReader();
    reader.onload = e => parseXML(e.target.result);
    reader.readAsText(file);
  };

  const handleDrop = e => {
    e.preventDefault();
    dropRef.current.classList.remove("dragover");
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = e => {
    e.preventDefault();
    dropRef.current.classList.add("dragover");
  };

  const handleDragLeave = () => dropRef.current.classList.remove("dragover");

  const startQrReader = () => {
    const scanner = new Html5Qrcode("qr-reader");
    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      text => fetch(text).then(r => r.text()).then(parseXML),
      err => console.warn(err)
    );
  };

  return (
    <div className="container">
      <div className="header">
        <Link to="/">
          <img src={logo} alt="Logo AGROK" className="logo" />
        </Link>
      </div>
      <div
        ref={dropRef}
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("fileInput").click()}
      >
        📁 Arraste o XML aqui ou clique para selecionar
        <input
          id="fileInput"
          type="file"
          accept=".xml"
          style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>

      <button onClick={startQrReader}>📷 Ler XML via QR Code</button>
      <div id="qr-reader" ref={qrRef} style={{ marginTop: "1rem" }} />

      {tipoXML && (
        <div className="info-block">
          <h2>{otherParty.tipo === "empresa" ? "Empresa" : "Pessoa"}</h2>
          {otherParty.tipo === "empresa" ? (
            <>
              <p><strong>CNPJ:</strong> {otherParty.cnpj}</p>
              <p><strong>Razão Social:</strong> {otherParty.razaoSocial}</p>
            </>
          ) : (
            <>
              <p><strong>CPF:</strong> {otherParty.cpf}</p>
              <p><strong>Nome:</strong> {otherParty.nome}</p>
            </>
          )}
        </div>
      )}

      {produtos.length > 0 && (
        <div className="info-block">
          <h2>📊 Produtos ({tipoXML})</h2>
          <BarChart width={600} height={300} data={produtos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="descricao" />
            <YAxis />
            <Tooltip formatter={val => `${val} unidades`} />
            <Bar dataKey="quantidade" />
          </BarChart>
        </div>
      )}

      <div className="info-block">
        <p><strong>🧮 Receita Total:</strong> R$ {receitaTotal.toFixed(2)}</p>
      </div>

      {historico.length > 0 && (
        <div className="info-block">
          <h2>📈 Histórico de Transações</h2>
          <BarChart
            width={600}
            height={300}
            data={historico}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="leitura" label={{ value: "Análise de Receita", position: "insideBottom" }} />
            <YAxis />
            <Tooltip formatter={(val, name, entry) => [`R$ ${val.toFixed(2)}`, entry.payload.tipo]} />
            <Bar dataKey="valor" />
          </BarChart>
          <p><strong>Valor final da receita:</strong> R$ {receitaTotal.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}