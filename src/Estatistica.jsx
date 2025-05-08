import React, { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Html5Qrcode } from "html5-qrcode";
import "./Estatistica.css"

function Estatistica() {
    const [produtos, setProdutos] = useState([]);
    const [faturamento, setFaturamento] = useState(0);
    const [custos, setCustos] = useState(0);
    const [compras, setCompras] = useState(0);
    const [totalVenda, setTotalVenda] = useState(0);
    const [tipoXML, setTipoXML] = useState("");
    const dropRef = useRef(null);
    const qrRef = useRef(null);

    const parseXML = (xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        // Verifica se é um XML de Nota Fiscal
        if (xmlDoc.getElementsByTagName("NotaFiscal").length > 0) {
            processarNotaFiscal(xmlDoc);
        }
    };

    const processarNotaFiscal = (xmlDoc) => {
        const produtosXML = Array.from(xmlDoc.getElementsByTagName("Produto"));
        const produtosData = produtosXML.map((p) => ({
            descricao: p.getElementsByTagName("Descricao")[0].textContent,
            quantidade: parseFloat(p.getElementsByTagName("Quantidade")[0].textContent),
            unidade: p.getElementsByTagName("Unidade")[0].textContent,
            valorTotal: parseFloat(p.getElementsByTagName("ValorTotal")[0].textContent),
        }));

        setProdutos(produtosData);
        setFaturamento(parseFloat(xmlDoc.getElementsByTagName("Total")[0].getElementsByTagName("ValorNota")[0].textContent));
    };

    const handleFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => parseXML(e.target.result);
        reader.readAsText(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        dropRef.current.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        dropRef.current.classList.add("dragover");
    };

    const handleDragLeave = () => {
        dropRef.current.classList.remove("dragover");
    };

    const startQrReader = () => {
        const scanner = new Html5Qrcode("qr-reader");
        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                fetch(decodedText)
                    .then(res => res.text())
                    .then(text => {
                        scanner.stop();
                        document.getElementById("qr-reader").innerHTML = "";
                        parseXML(text);
                    });
            },
            (errorMessage) => {
                console.warn(errorMessage);
            }
        );
    };

    const receita = faturamento - custos;

    return (
        <div>
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
                    onChange={(e) => handleFile(e.target.files[0])}
                />
            </div>

            <button onClick={startQrReader}>📷 Ler XML via QR Code</button>
            <div id="qr-reader" style={{ marginTop: "1rem" }} ref={qrRef}></div>

            {produtos.length > 0 && (
                <>
                    <h2>📊 Produtos</h2>
                    <BarChart width={600} height={300} data={produtos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="descricao" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantidade" fill="#8884d8" />
                    </BarChart>

                    <div style={{ marginTop: "2rem" }}>
                        <p><strong>💰 Faturamento:</strong> R$ {faturamento.toFixed(2)}</p>
                        <p><strong>🧮 Receita:</strong> R$ {receita.toFixed(2)}</p>
                    </div>
                </>
            )}
        </div>
    );
}

export default Estatistica;
