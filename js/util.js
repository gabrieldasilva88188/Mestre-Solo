"use strict";
/* Utilidades usadas por todos os scripts. */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = s => s.charAt(0).toLowerCase() + s.slice(1);
const semAcento = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function novoId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function agoraISO(){ return new Date().toISOString(); }
function fmtHora(iso){
  const d = new Date(iso); if (isNaN(d)) return "";
  return d.toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"});
}
function fmtDataHora(iso){
  const d = new Date(iso); if (isNaN(d)) return "";
  return d.toLocaleString("pt-BR", {day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"});
}

/* Um item de resultado: {rotulo, valor, detalhe?, dado?, resultado?, dados?} */
function textoDado(it){
  if (it.dados) return it.dados;
  if (it.dado) return `d${it.dado} · ${it.resultado}`;
  return "";
}
function linhasHTML(itens){
  return `<div class="rows">${itens.map(it => `
    <div class="row">
      <span class="k">${esc(it.rotulo)}</span>
      <span class="v">${esc(it.valor)}${it.detalhe ? `<span class="x">${esc(it.detalhe)}</span>` : ""}</span>
      <span class="die">${esc(textoDado(it))}</span>
    </div>`).join("")}</div>`;
}
/* Converte o resultado de pick() em item. */
function item(rotulo, p, extra = {}){
  const o = {rotulo, valor: p.v};
  if (p.d){ o.dado = p.d; o.resultado = p.r; }
  return Object.assign(o, extra);
}

async function copiarTexto(texto, botao, rotuloOriginal, areaReserva){
  try {
    await navigator.clipboard.writeText(texto);
    botao.textContent = "Copiado";
    setTimeout(() => botao.textContent = rotuloOriginal, 1600);
    return true;
  } catch (e) {
    if (areaReserva){ areaReserva.hidden = false; areaReserva.value = texto; areaReserva.focus(); areaReserva.select(); }
    botao.textContent = "Selecione e copie";
    setTimeout(() => botao.textContent = rotuloOriginal, 2500);
    return false;
  }
}
