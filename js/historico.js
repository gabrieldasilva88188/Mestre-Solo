"use strict";
/* Aba Histórico, diário da lateral, exportar e importar o JSON da sessão. */

let filtroTipo = "todos";
let busca = "";
let sessaoPendente = null;

function aoMudarHistorico(){
  renderDiarioLateral();
  $("#histCount").textContent = S.historico.length;
  if (!$("#v-historico").hidden) renderHistorico();
}

function registroHTML(e){
  const corpo = e.nota
    ? `<div class="note">${esc(e.nota)}</div>`
    : (e.itens && e.itens.length ? linhasHTML(e.itens) : "");
  return `<article class="hentry t-${esc(e.tipo)}">
    <div class="hhead">
      <span class="pill">${esc(TIPOS[e.tipo] || e.tipo)}</span>
      <span class="t">${esc(e.titulo)}</span>
      <span class="when">${esc(fmtDataHora(e.quando))}</span>
      <button class="xbtn" data-histdel="${esc(e.id)}" aria-label="Apagar este registro">×</button>
    </div>${corpo}</article>`;
}

/* Diário compacto da lateral: só os últimos registros. */
function renderDiarioLateral(){
  const ult = S.historico.slice(-6).reverse();
  $("#log").innerHTML = ult.length ? ult.map(e => `
    <div class="entry${e.tipo === "evento" ? " ev" : ""}">
      <div class="meta"><span>Cena ${e.cena} · ${esc(fmtHora(e.quando))}</span><span>${esc(TIPOS[e.tipo] || "")}</span></div>
      <div class="t">${esc(e.titulo)}</div>
      ${e.nota ? `<div class="note">${esc(e.nota)}</div>` : `<ul>${(e.itens || []).slice(0, 4).map(it => `<li><b>${esc(it.rotulo)}:</b> ${esc(it.valor)}</li>`).join("")}</ul>`}
    </div>`).join("") : `<p class="rule" style="padding:10px 0">Nada registrado ainda. Cada rolagem aparece aqui.</p>`;
  $("#sideHistCount").textContent = S.historico.length;
}

function textoBusca(e){
  return semAcento([e.titulo, e.nota, ...(e.itens || []).flatMap(i => [i.rotulo, i.valor, i.detalhe])].join(" "));
}

function renderHistorico(){
  const h = S.historico;
  const conta = {};
  h.forEach(e => conta[e.tipo] = (conta[e.tipo] || 0) + 1);
  const cenas = new Set(h.map(e => e.cena)).size;
  $("#histStats").innerHTML = [
    [h.length, "Registros"], [S.eventos.length, "Eventos"], [conta.oraculo || 0, "Perguntas"], [cenas, "Cenas jogadas"], [S.caos, "Caos atual"]
  ].map(([n, r]) => `<div><b>${n}</b><span>${r}</span></div>`).join("");

  $("#histChips").innerHTML = [["todos", "Tudo", h.length], ...Object.entries(TIPOS).map(([k, v]) => [k, v, conta[k] || 0])]
    .map(([k, v, n]) => `<button class="chip" data-filtro="${k}" aria-pressed="${filtroTipo === k}" ${n === 0 && k !== "todos" && filtroTipo !== k ? "disabled" : ""}>${esc(v)}<span>${n}</span></button>`).join("");

  const q = semAcento(busca.trim());
  const lista = h.filter(e => (filtroTipo === "todos" || e.tipo === filtroTipo) && (!q || textoBusca(e).includes(q)));
  if (!lista.length){
    $("#histList").innerHTML = `<p class="empty-state">${h.length ? "Nenhum registro com esse filtro." : "O histórico está vazio. Jogue um pouco e os registros aparecem aqui."}</p>`;
    return;
  }
  /* Agrupa por cena, da mais recente para a mais antiga. */
  const grupos = new Map();
  for (let i = lista.length - 1; i >= 0; i--){
    const e = lista[i];
    if (!grupos.has(e.cena)) grupos.set(e.cena, []);
    grupos.get(e.cena).push(e);
  }
  $("#histList").innerHTML = [...grupos.entries()].sort((a, b) => b[0] - a[0]).map(([cena, regs]) =>
    `<section class="histgroup"><h3>Cena ${cena} <span>${regs.length} ${regs.length === 1 ? "registro" : "registros"}</span></h3>${regs.map(registroHTML).join("")}</section>`
  ).join("");
}

function historicoComoTexto(){
  return S.historico.map(e => {
    const cab = `[Cena ${e.cena} · ${fmtDataHora(e.quando)}] ${TIPOS[e.tipo] || ""}: ${e.titulo}`;
    if (e.nota) return cab + "\n  " + e.nota.replace(/\n/g, "\n  ");
    return cab + "\n" + (e.itens || []).map(it => `  ${it.rotulo}: ${it.valor}${textoDado(it) ? ` (${textoDado(it)})` : ""}`).join("\n");
  }).join("\n\n");
}

function status(msg, tipo = ""){
  const el = $("#histStatus"); el.textContent = msg; el.className = "status " + tipo;
}

function baixarJSON(){
  const d = new Date(), p = n => String(n).padStart(2, "0");
  const nome = `mestre-solo-sessao-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.json`;
  try {
    const url = URL.createObjectURL(new Blob([sessaoComoJSON()], {type: "application/json"}));
    const a = document.createElement("a");
    a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    status(`Arquivo ${nome} enviado para download. Se nada baixar (a prévia do Claude bloqueia downloads), use “Copiar JSON”.`, "ok");
  } catch (e) {
    status("Este navegador bloqueou o download. Use “Copiar JSON” e cole num arquivo .json.", "bad");
  }
}

function lerArquivo(arquivo){
  if (!arquivo) return;
  const leitor = new FileReader();
  leitor.onload = () => {
    try {
      sessaoPendente = lerSessao(String(leitor.result));
      $("#importInfo").innerHTML = `<b>${esc(arquivo.name)}</b>: ${sessaoPendente.historico.length} registros, ${sessaoPendente.eventos.length} eventos, cena ${sessaoPendente.cena}, Caos ${sessaoPendente.caos}, ${sessaoPendente.fios.length} fios e ${sessaoPendente.personagens.length} personagens. Carregar substitui a sessão atual; baixe o JSON atual antes se quiser guardá-la.`;
      $("#importBox").hidden = false;
      status("");
    } catch (e) {
      sessaoPendente = null; $("#importBox").hidden = true;
      status(e.message, "bad");
    }
  };
  leitor.onerror = () => status("Não consegui ler esse arquivo.", "bad");
  leitor.readAsText(arquivo);
}

function ligarHistorico(){
  $("#histChips").addEventListener("click", e => {
    const b = e.target.closest("[data-filtro]"); if (!b) return;
    filtroTipo = b.dataset.filtro; renderHistorico();
  });
  $("#histSearch").addEventListener("input", e => { busca = e.target.value; renderHistorico(); });
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-histdel]"); if (!b) return;
    apagarRegistro(b.dataset.histdel); aoMudarHistorico();
  });
  $("#btnBaixar").onclick = baixarJSON;
  $("#btnCopiarJSON").onclick = () => copiarTexto(sessaoComoJSON(), $("#btnCopiarJSON"), "Copiar JSON", $("#histFallback"));
  $("#btnCopiarTexto").onclick = () => copiarTexto(historicoComoTexto(), $("#btnCopiarTexto"), "Copiar como texto", $("#histFallback"));
  $("#fileImport").addEventListener("change", e => { lerArquivo(e.target.files[0]); e.target.value = ""; });
  $("#importOk").onclick = () => {
    if (!sessaoPendente) return;
    S = sessaoPendente; sessaoPendente = null;
    salvar(); $("#importBox").hidden = true;
    renderTudo();
    status("Sessão carregada.", "ok");
  };
  $("#importCancel").onclick = () => { sessaoPendente = null; $("#importBox").hidden = true; };
  let armado = null;
  $("#btnLimparHist").onclick = () => {
    const b = $("#btnLimparHist");
    if (armado){
      clearTimeout(armado); armado = null;
      S.historico = []; S.eventos = []; salvar(); aoMudarHistorico();
      b.textContent = "Limpar histórico"; status("Histórico e eventos apagados.", "ok"); return;
    }
    b.textContent = "Clique de novo para apagar tudo";
    armado = setTimeout(() => { armado = null; b.textContent = "Limpar histórico"; }, 3500);
  };
}
