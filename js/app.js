"use strict";
/* Oráculo, cenas, tabelas, rolador, geradores, listas e inicialização. */

/* ---------- Renderização geral ---------- */
function chanceSim(li, caos){ return clamp(LIK[li].p + (caos - 5) * 5, 1, 99); }
function faixasOraculo(y){ return {ey: Math.ceil(y / 5), y, enIni: 100 - Math.ceil((100 - y) / 5) + 1}; }

function renderControles(){
  $("#pips").innerHTML = Array.from({length: 9}, (_, i) => `<button class="pip${i < S.caos ? " on" : ""}${i + 1 === S.caos ? " cur" : ""}" data-caos="${i + 1}" aria-label="Caos ${i + 1}" aria-pressed="${i + 1 === S.caos}">${i + 1}</button>`).join("");
  $("#modeSite").setAttribute("aria-pressed", S.modo === "site");
  $("#modeUser").setAttribute("aria-pressed", S.modo === "manual");
  $("#manualBanner").hidden = S.modo !== "manual";
  $("#sceneBadge").textContent = "Cena " + S.cena;
  $$("#genreSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.genre === S.genero));
  $("#mlevel").value = String(S.nivelMonstro || 0);
  $("#histCount").textContent = S.historico.length;
  renderProb();
}
function renderProb(){
  $("#likgrid").innerHTML = LIK.map((l, i) => `<button data-lik="${i}" aria-pressed="${i === S.prob}">${esc(l.n)}<span>${chanceSim(i, S.caos)}%</span></button>`).join("");
  const y = chanceSim(S.prob, S.caos), b = faixasOraculo(y);
  const f = x => String(x).padStart(2, "0");
  const seg = [["ey", b.ey], ["y", y - b.ey], ["n", b.enIni - 1 - y], ["en", 100 - b.enIni + 1]];
  $("#bands").innerHTML = seg.filter(s => s[1] > 0).map(s => `<div class="${s[0]}" style="width:${s[1]}%">${s[1] >= 8 ? s[1] + "%" : ""}</div>`).join("");
  const p = [`SIM excepcional 01–${f(b.ey)}`];
  if (y > b.ey) p.push(`SIM ${f(b.ey + 1)}–${f(y)}`);
  if (b.enIni - 1 > y) p.push(`NÃO ${f(y + 1)}–${f(b.enIni - 1)}`);
  p.push(`NÃO excepcional ${b.enIni === 100 ? "00" : f(b.enIni) + "–00"}`);
  $("#bandlegend").textContent = p.join(" · ");
}
function renderListas(){
  const li = (arr, tipo) => arr.length
    ? arr.map((t, i) => `<li><span>${esc(t)}</span><button class="xbtn" data-del="${tipo}" data-i="${i}" aria-label="Remover ${esc(t)}">×</button></li>`).join("")
    : `<li class="empty">Lista vazia.</li>`;
  $("#threadList").innerHTML = li(S.fios, "fios");
  $("#npcList").innerHTML = li(S.personagens, "personagens");
}
function renderTabelas(){
  $("#tiles").innerHTML = INSP.map((t, i) => `<button data-insp="${i}">${esc(t.nome)}<span>${esc(t.dados)}</span></button>`).join("");
  const bloco = (nome, dado, linhas) => `<details class="tbl"><summary>${esc(nome)} <span>${esc(dado)}</span></summary><ul class="tbllist">${linhas.map(l => `<li><span class="rg">${esc(l[0])}</span><span>${esc(cap(l[1]))}</span></li>`).join("")}</ul></details>`;
  const f2 = n => String(n).padStart(2, "0");
  let html = bloco("Foco do evento", "d100", FOCO.map((f, i) => [`${f2(i ? FOCO[i - 1][0] + 1 : 1)}–${f[0] === 100 ? "00" : f2(f[0])}`, f[1]]));
  html += bloco("Reação de personagem", "2d6", REACAO.map((r, i) => { const lo = i ? REACAO[i - 1][0] + 1 : 2; return [lo === r[0] ? String(lo) : `${lo}–${r[0]}`, `${r[1]}: ${r[2]}`]; }));
  html += TABLE_INFO.map(([id, nome]) => { const t = T[id], fx = faixas(t.length); return bloco(nome, "d" + dadoPara(t.length), t.map((v, i) => [fx[i], v])); }).join("");
  for (const g of Object.keys(G)){
    for (const [k, r] of [["local", "Aventura: local"], ["antagonista", "Aventura: antagonista"], ["recompensa", "Aventura: recompensa"]]){
      const t = G[g][k], fx = faixas(t.length);
      html += bloco(`${r} (${GENRE_NAME[g]})`, "d" + dadoPara(t.length), t.map((v, i) => [fx[i], v]));
    }
  }
  $("#alltables").innerHTML = html;
}
function renderTudo(){
  $("#sceneText").value = S.cenaEsperada || "";
  renderControles(); renderListas(); aoMudarHistorico();
}

/* ---------- Oráculo ---------- */
const NOTA_RESPOSTA = {
  "SIM excepcional": "Sim, e ainda por cima… A resposta vem mais forte ou com um bônus.",
  "SIM": "Sim.",
  "NÃO": "Não.",
  "NÃO excepcional": "Não, e pior… O contrário é verdade, ou a recusa traz um problema."
};
function ehEvento(r){ return r < 100 && r % 11 === 0 && (r / 11) <= S.caos; }

async function eventoAleatorio(){
  const itens = [], ev = {};
  const [r] = await roll(1, 100, "Foco do evento aleatório");
  const f = FOCO.find(x => r <= x[0]);
  Object.assign(ev, {foco: f[1], explicacao: f[2], rolagemFoco: r});
  itens.push({rotulo: "Foco", valor: f[1], detalhe: f[2], dado: 100, resultado: r});
  if (f[3] === "npc" && S.personagens.length){ const p = await pickList(S.personagens, "Qual personagem"); ev.personagem = p.v; itens.push(item("Personagem", p)); }
  if (f[3] === "fio" && S.fios.length){ const p = await pickList(S.fios, "Qual fio"); ev.fio = p.v; itens.push(item("Fio", p)); }
  const a = await pick(T.acao, "Ação"), t = await pick(T.tema, "Tema");
  ev.acao = a.v; ev.tema = t.v;
  itens.push(item("Ação", a), item("Tema", t));
  return {itens, ev};
}
const eventoHTML = itens => `<div class="event"><h3>Evento aleatório</h3>${linhasHTML(itens)}</div>`;

async function perguntarOraculo(){
  const q = $("#q").value.trim();
  const y = chanceSim(S.prob, S.caos), b = faixasOraculo(y);
  await emLote(async () => {
    const [r] = await roll(1, 100, "Oráculo" + (q ? ": " + q : ""));
    let resp;
    if (r <= b.ey) resp = "SIM excepcional"; else if (r <= y) resp = "SIM"; else if (r >= b.enIni) resp = "NÃO excepcional"; else resp = "NÃO";
    const sim = resp.startsWith("SIM"), exc = resp.includes("excepcional"), rt = r === 100 ? "00" : r;
    const st = $("#stamp");
    st.className = "stamp " + (sim ? "yes" : "no");
    st.innerHTML = `${sim ? "Sim" : "Não"}<small>${exc ? "excepcional" : "d100 · " + rt}</small>`;
    void st.offsetWidth; st.classList.add("anim");
    $("#stampnote").textContent = NOTA_RESPOSTA[resp] + (exc ? ` (d100 · ${rt})` : "");
    let html = "";
    let evento = null;
    if (ehEvento(r)){ evento = await eventoAleatorio(); html = eventoHTML(evento.itens); }
    $("#oracleOut").innerHTML = html;
    registrar("oraculo", "Oráculo", [
      {rotulo: "Pergunta", valor: q || "(sem texto)"},
      {rotulo: "Probabilidade", valor: `${LIK[S.prob].n} · ${y}% com Caos ${S.caos}`},
      {rotulo: "Resposta", valor: resp, dado: 100, resultado: r}
    ]);
    if (evento) registrarEvento("oraculo", evento.ev, evento.itens);
  });
}
async function eventoManual(){
  await emLote(async () => {
    const {itens, ev} = await eventoAleatorio();
    $("#oracleOut").innerHTML = eventoHTML(itens);
    registrarEvento("manual", ev, itens);
  });
}

/* ---------- Cenas ---------- */
async function testarCena(){
  const txt = $("#sceneText").value.trim(); S.cenaEsperada = txt; salvar();
  await emLote(async () => {
    const [r] = await roll(1, 10, `Teste da cena ${S.cena} (d10 contra Caos ${S.caos})`);
    const itens = [{rotulo: "Cena esperada", valor: txt || "(não descrita)"}];
    let veredito, html = "", evento = null;
    if (r > S.caos){
      veredito = "como esperada";
      itens.push({rotulo: "Resultado", valor: "Cena como esperada", detalhe: "Comece a cena do jeito que você imaginou.", dado: 10, resultado: r});
    } else if (r % 2 === 1){
      veredito = "alterada";
      itens.push({rotulo: "Resultado", valor: "Cena alterada", detalhe: "A cena começa diferente do que você esperava.", dado: 10, resultado: r});
      const a = await pick(T.alteracao, "Como a cena mudou");
      itens.push(item("Alteração", a));
      if (a.v.startsWith("Interprete")){
        const ac = await pick(T.acao, "Ação"), tm = await pick(T.tema, "Tema");
        itens.push(item("Ação", ac), item("Tema", tm));
      }
    } else {
      veredito = "interrompida";
      itens.push({rotulo: "Resultado", valor: "Cena interrompida", detalhe: "Algo diferente toma o lugar da cena esperada. Veja o evento.", dado: 10, resultado: r});
      evento = await eventoAleatorio();
      html = eventoHTML(evento.itens);
    }
    $("#sceneOut").innerHTML = `<h3 class="result-title">Cena ${S.cena}: ${esc(veredito)}</h3>${linhasHTML(itens)}${html}`;
    registrar("cena", `Cena ${S.cena}: ${veredito}`, itens);
    if (evento) registrarEvento("cena", evento.ev, evento.itens);
  });
}
function encerrarCena(delta){
  const antes = S.caos, n = S.cena;
  S.caos = clamp(S.caos + delta, 1, 9);
  registrar("cena", `Fim da cena ${n}`, [
    {rotulo: "Controle", valor: delta < 0 ? "Eu estava no controle" : delta > 0 ? "Fugiu do controle" : "Equilibrado"},
    {rotulo: "Fator de Caos", valor: `${antes} → ${S.caos}`}
  ]);
  S.cena++;
  S.cenaEsperada = ""; $("#sceneText").value = ""; $("#sceneOut").innerHTML = "";
  salvar(); renderControles();
}

/* ---------- Tabelas de inspiração ---------- */
const INSP = [
  {nome: "Ação + Tema", dados: "d100 + d100", run: async () => { const a = await pick(T.acao, "Ação"), t = await pick(T.tema, "Tema"); return [item("Ação", a), item("Tema", t)]; }},
  {nome: "Descritor", dados: "d100 + d100", run: async () => { const m = await pick(T.modo, "Modo"), a = await pick(T.adjetivo, "Adjetivo"); return [item("Modo", m), item("Adjetivo", a)]; }},
  {nome: "Personagem rápido", dados: "d20 · d20 · d12", run: async () => {
    const p = await pick(T.profissao, "Papel"), t = await pick(T.traco, "Traço"), m = await pick(T.motivacao, "Motivação");
    return [{rotulo: "Nome", valor: gerarNome(), dados: "site"}, item("Papel", p), item("Traço", t), item("Motivação", m)]; }},
  {nome: "Reação de personagem", dados: "2d6", run: async () => {
    const v = await roll(2, 6, "Reação de personagem (2d6)"); const s = v.soTotal ? v[0] : v[0] + v[1];
    const r = REACAO.find(x => s <= x[0]); return [{rotulo: "Reação", valor: r[1], detalhe: r[2], dados: `2d6 · ${s}`}]; }},
  {nome: "Local", dados: "d20 + d100", run: async () => { const l = await pick(T.local, "Local"), a = await pick(T.adjetivo, "Adjetivo"); return [item("Local", l), item("Atmosfera", a)]; }},
  {nome: "Objeto", dados: "d20 + d100", run: async () => { const o = await pick(T.objeto, "Objeto"), a = await pick(T.adjetivo, "Adjetivo"); return [item("Objeto", o), item("Aparência", a)]; }},
  {nome: "Clima", dados: "d12", run: async () => [item("Clima", await pick(T.clima, "Clima"))]},
  {nome: "Tesouro", dados: "d12", run: async () => [item("Tesouro", await pick(T.tesouro, "Tesouro"))]},
  {nome: "Obstáculo", dados: "d10", run: async () => [item("Obstáculo", await pick(T.obstaculo, "Obstáculo"))]},
  {nome: "Nome", dados: "sorteado pelo site", run: async () => [1, 2, 3].map(i => ({rotulo: "Nome " + i, valor: gerarNome(), dados: "site"}))}
];
async function rolarInspiracao(i){
  const t = INSP[i];
  await emLote(async () => {
    const itens = await t.run();
    $("#inspOut").innerHTML = `<div class="panel" style="background:var(--paper)"><h3 class="result-title">${esc(t.nome)}</h3>${linhasHTML(itens)}</div>`;
    registrar("inspiracao", t.nome, itens);
  });
}

/* ---------- Rolador ---------- */
async function rolarDados(str){
  $("#exprErr").textContent = "";
  try {
    const res = await emLote(() => rolarExpressao(str));
    $("#bignum").textContent = res.total;
    $("#dicedetail").textContent = `${str} → ${res.detalhe} = ${res.total}`;
    registrar("dado", "Rolagem: " + str, [{rotulo: "Total", valor: String(res.total)}, {rotulo: "Dados", valor: res.detalhe}]);
  } catch (e) {
    if (e.message !== "cancel") $("#exprErr").textContent = e.message;
  }
}

/* ---------- Aventura ---------- */
async function gerarAventura(){
  const g = G[S.genero];
  await emLote(async () => {
    const it = [];
    const P = async (rotulo, tab) => { const p = await pick(tab, rotulo); it.push(item(rotulo, p)); return p.v; };
    const t1 = await pick(T.tema, "Título: primeiro tema"), t2 = await pick(T.tema, "Título: segundo tema");
    await P("Gancho", T.gancho);
    await P("Contratante", T.patrono);
    const obj = await P("Objetivo", T.objetivo);
    const local = await P("Local", g.local);
    const atm = await P("Atmosfera", T.adjetivo);
    const ant = await P("Antagonista", g.antagonista);
    const nomeAnt = gerarNome();
    it.push({rotulo: "Nome do antagonista", valor: nomeAnt, dados: "site"});
    await P("Motivação dele", T.motivacao);
    const comp = await P("Complicação", T.complicacao);
    const rev = await P("Reviravolta", T.reviravolta);
    const rec = await P("Recompensa", g.recompensa);
    await P("Prazo", T.pressao);
    const o1 = await pick(T.obstaculo, "Cena 1: obstáculo");
    const o2 = await pick(T.obstaculo, "Cena 2: obstáculo");
    const a2 = await pick(T.acao, "Cena 2: pista (ação)"), m2 = await pick(T.tema, "Cena 2: pista (tema)");
    const c4 = await pick(T.local, "Cena 4: onde acontece o confronto");
    const cenas = [
      {rotulo: "1 · Chegada", valor: `${local}. Obstáculo: ${lowerFirst(o1.v)}.`, detalhe: `Clima do lugar: ${lowerFirst(atm)}.`, dado: o1.d, resultado: o1.r},
      {rotulo: "2 · Desafio", valor: `${o2.v}. Pista: ${a2.v} + ${m2.v}.`, detalhe: "Interprete a pista como algo que aproxima você do objetivo.", dado: o2.d, resultado: o2.r},
      {rotulo: "3 · Revés", valor: comp + ".", detalhe: "Aumente o Caos em 1 se a situação fugir do controle."},
      {rotulo: "4 · Clímax", valor: `Confronto com ${lowerFirst(ant)}, ${nomeAnt}.`, detalhe: `Local do confronto: ${lowerFirst(c4.v)}.`, dado: c4.d, resultado: c4.r},
      {rotulo: "5 · Desfecho", valor: rev + ".", detalhe: `Recompensa em jogo: ${lowerFirst(rec)}.`}
    ];
    const titulo = `${t1.v} e ${t2.v}`;
    $("#advOut").innerHTML = `
      <div><p class="lab">${esc(GENRE_NAME[S.genero])} · d100 ${t1.r} + ${t2.r}</p><h3 class="result-title">${esc(titulo)}</h3></div>
      ${linhasHTML(it)}
      <h3 style="margin:6px 0 0">Roteiro em cinco cenas</h3>
      ${linhasHTML(cenas)}
      <div class="hstack">
        <button class="btn small" id="advThread">Adicionar objetivo aos fios</button>
        <button class="btn small ghost" id="advNpc">Adicionar antagonista aos personagens</button>
      </div>`;
    $("#advThread").onclick = () => { adicionar("fios", `${obj} (${titulo})`); $("#advThread").disabled = true; };
    $("#advNpc").onclick = () => { adicionar("personagens", `${nomeAnt}, ${lowerFirst(ant)}`); $("#advNpc").disabled = true; };
    registrar("aventura", "Aventura: " + titulo, it.concat(cenas));
  });
}

/* ---------- Monstro ---------- */
async function gerarMonstro(){
  await emLote(async () => {
    const it = [];
    let nivel = S.nivelMonstro, rNivel = null;
    if (!nivel){ [rNivel] = await roll(1, 10, "Nível de ameaça"); nivel = rNivel; }
    const P = async (rotulo, tab) => { const p = await pick(tab, rotulo); it.push(item(rotulo, {...p, v: cap(p.v)})); return p; };
    const tam = await P("Tamanho", T.tamanho);
    const iTam = T.tamanho.indexOf(tam.v);
    const forma = await pick(T.forma, "Forma");
    let formaTxt = forma.v;
    if (forma.v === "uma quimera"){
      const base = T.forma.slice(0, 19);
      const f1 = await pick(base, "Quimera: primeira forma");
      let f2 = await pick(base, "Quimera: segunda forma");
      if (f2.v === f1.v) f2 = {v: qualquer(base.filter(x => x !== f1.v))};
      formaTxt = `uma mistura de ${f1.v} e ${f2.v}`;
    }
    it.push(item("Forma", {...forma, v: cap(formaTxt)}));
    const tr1 = await pick(T.tracoMonstro, "Traço 1");
    let tr2 = await pick(T.tracoMonstro, "Traço 2");
    if (tr2.v === tr1.v) tr2 = {v: qualquer(T.tracoMonstro.filter(x => x !== tr1.v))};
    it.push(item("Traço", {...tr1, v: cap(tr1.v)}), item("Traço", {...tr2, v: cap(tr2.v)}));
    for (const [r, tab] of [["Locomoção", T.locomocao], ["Ataque", T.ataque], ["Habilidade", T.habilidade], ["Fraqueza", T.fraqueza], ["Comportamento", T.comportamento], ["Habitat", T.habitat], ["O que quer", T.desejo], ["Sinal de presença", T.sinal], ["Despojo", T.despojo], ["Origem", T.origem]]) await P(r, tab);
    const nome = `${gerarNomeMonstro()}, ${qualquer(T.epiteto)}`;
    const pv = Math.max(2, Math.round(nivel * 8 * SIZE_MULT[iTam]));
    const ficha = [["Nível", nivel], ["Ameaça", THREAT[nivel - 1]], ["PV", pv], ["Defesa", 10 + nivel], ["Ataque", "+" + (nivel + 1)], ["Dano", DMG[nivel - 1]], ["Moral", Math.min(12, 6 + Math.floor(nivel / 2))]];
    const desc = `Lembra ${formaTxt}, com ${tr1.v} e ${tr2.v}.`;
    $("#monOut").innerHTML = `
      <div><p class="lab">${rNivel ? `Nível sorteado · d10 · ${rNivel}` : "Nível escolhido"} · nome sorteado pelo site</p><h3 class="result-title">${esc(nome)}</h3></div>
      <p class="desc">${esc(desc)}</p>
      <div class="statblock">${ficha.map(s => `<div class="stat"><b>${esc(s[1])}</b><span>${esc(s[0])}</span></div>`).join("")}</div>
      <p class="rule">Ficha genérica: Defesa funciona como classe de armadura, Ataque é o bônus na rolagem e Moral é testada em 2d6 (foge se passar do valor). Ajuste para o seu sistema.</p>
      ${linhasHTML(it)}
      <div class="hstack"><button class="btn small" id="monNpc">Adicionar aos personagens</button></div>`;
    $("#monNpc").onclick = () => { adicionar("personagens", nome + " (monstro)"); $("#monNpc").disabled = true; };
    registrar("monstro", "Monstro: " + nome, [{rotulo: "Descrição", valor: desc}, {rotulo: "Ficha", valor: ficha.map(s => `${s[0]} ${s[1]}`).join(" · ")}].concat(it));
  });
}

/* ---------- Listas ---------- */
function adicionar(lista, texto){
  texto = texto.trim(); if (!texto) return;
  S[lista].push(texto); salvar(); renderListas();
}
async function sortearDe(lista, titulo){
  if (!S[lista].length) return;
  await emLote(async () => {
    const p = await pickList(S[lista], titulo);
    registrar("lista", titulo, [item(lista === "fios" ? "Fio" : "Personagem", p)]);
  });
}

/* ---------- Navegação ---------- */
const VIEWS = ["oraculo", "cena", "tabelas", "dados", "aventura", "monstro", "historico"];
function rota(){
  const h = location.hash.replace("#", "");
  const v = VIEWS.includes(h) ? h : "oraculo";
  VIEWS.forEach(x => { $("#v-" + x).hidden = x !== v; });
  $$("[data-view]").forEach(a => { if (a.dataset.view === v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  if (v === "historico") renderHistorico();
}

/* ---------- Ligações ---------- */
const seguro = fn => async (...a) => { try { await fn(...a); } catch (e) { if (e.message !== "cancel") console.error(e); } };
function ligar(){
  $("#pips").addEventListener("click", e => { const b = e.target.closest("[data-caos]"); if (!b) return; S.caos = +b.dataset.caos; salvar(); renderControles(); });
  $("#cfDown").onclick = () => { S.caos = clamp(S.caos - 1, 1, 9); salvar(); renderControles(); };
  $("#cfUp").onclick = () => { S.caos = clamp(S.caos + 1, 1, 9); salvar(); renderControles(); };
  $("#modeSite").onclick = () => { S.modo = "site"; salvar(); renderControles(); };
  $("#modeUser").onclick = () => { S.modo = "manual"; salvar(); renderControles(); };
  $("#likgrid").addEventListener("click", e => { const b = e.target.closest("[data-lik]"); if (!b) return; S.prob = +b.dataset.lik; salvar(); renderProb(); });
  $("#askBtn").onclick = seguro(perguntarOraculo);
  $("#q").addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); seguro(perguntarOraculo)(); } });
  $("#evBtn").onclick = seguro(eventoManual);
  $("#sceneBtn").onclick = seguro(testarCena);
  $("#sceneText").addEventListener("input", e => { S.cenaEsperada = e.target.value; salvar(); });
  $("#endDown").onclick = () => encerrarCena(-1);
  $("#endUp").onclick = () => encerrarCena(1);
  $("#endSame").onclick = () => encerrarCena(0);
  $("#tiles").addEventListener("click", e => { const b = e.target.closest("[data-insp]"); if (b) seguro(rolarInspiracao)(+b.dataset.insp); });
  $("#dicebar").innerHTML = [4, 6, 8, 10, 12, 20, 100].map(d => `<button data-expr="1d${d}">d${d}</button>`).join("");
  document.addEventListener("click", e => { const b = e.target.closest("button[data-expr]"); if (b){ $("#expr").value = b.dataset.expr; rolarDados(b.dataset.expr); } });
  $("#exprForm").addEventListener("submit", e => { e.preventDefault(); rolarDados($("#expr").value); });
  $$("#genreSeg button").forEach(b => b.onclick = () => { S.genero = b.dataset.genre; salvar(); renderControles(); });
  $("#advBtn").onclick = seguro(gerarAventura);
  $("#mlevel").addEventListener("change", e => { S.nivelMonstro = +e.target.value; salvar(); });
  $("#monBtn").onclick = seguro(gerarMonstro);
  $("#threadForm").addEventListener("submit", e => { e.preventDefault(); adicionar("fios", $("#threadIn").value); $("#threadIn").value = ""; });
  $("#npcForm").addEventListener("submit", e => { e.preventDefault(); adicionar("personagens", $("#npcIn").value); $("#npcIn").value = ""; });
  $("#threadPick").onclick = seguro(() => sortearDe("fios", "Fio sorteado"));
  $("#npcPick").onclick = seguro(() => sortearDe("personagens", "Personagem sorteado"));
  document.addEventListener("click", e => {
    const d = e.target.closest("[data-del]");
    if (d){ S[d.dataset.del].splice(+d.dataset.i, 1); salvar(); renderListas(); }
  });
  $("#noteBtn").onclick = () => { const t = $("#noteIn").value.trim(); if (!t) return; registrar("nota", "Anotação", [], {nota: t}); $("#noteIn").value = ""; };
  ligarHistorico();
  window.addEventListener("hashchange", rota);
}

/* ---------- Início ---------- */
function iniciar(dados){
  const salvo = (dados && Array.isArray(dados.historico)) ? validarEstado(dados) : carregar();
  S = salvo || exemplo();
  salvar();
  window.claude?.hot?.snapshot?.(() => S);
  ligar();
  renderTabelas();
  renderTudo();
  rota();
}
window.claude?.hot?.ready ? window.claude.hot.ready(iniciar) : iniciar(window.claude?.hot?.data ?? {});
