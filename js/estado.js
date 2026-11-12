"use strict";
/* Estado da sessão, salvamento no navegador e o formato JSON da sessão.

   Formato do arquivo JSON (veja exemplos/sessao-exemplo.json):
   {
     "formato": "mestre-solo/sessao",
     "versao": 1,
     "exportadoEm": "ISO 8601",
     "estado":   { caos, cena, modoDados, genero, probabilidade, nivelMonstro, cenaEsperada, fios[], personagens[] },
     "eventos":  [ { id, quando, cena, origem, foco, explicacao, acao, tema, personagem?, fio?, rolagemFoco } ],
     "historico":[ { id, quando, cena, tipo, titulo, itens[{rotulo, valor, detalhe?, dado?, resultado?, dados?}], nota?, eventoId? } ]
   }
*/

const CHAVE = "mestre-solo-v2";
const CHAVE_ANTIGA = "mestre-solo-v1";
const FORMATO = "mestre-solo/sessao";
const VERSAO = 1;
const LIMITE_HISTORICO = 2000;

const TIPOS = {
  oraculo: "Oráculo",
  evento: "Evento",
  cena: "Cena",
  inspiracao: "Tabela",
  dado: "Rolagem",
  aventura: "Aventura",
  monstro: "Monstro",
  lista: "Sorteio",
  nota: "Anotação"
};
const ORIGENS = {oraculo: "Do oráculo", cena: "Interrupção de cena", manual: "Gerado à mão"};

function estadoInicial(){
  return {
    caos: 5, cena: 1, modo: "site", prob: 4, genero: "fantasia", nivelMonstro: 0, cenaEsperada: "",
    fios: [], personagens: [], eventos: [], historico: []
  };
}
let S = estadoInicial();

function salvar(){ try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) {} }
function carregar(){
  try {
    const j = localStorage.getItem(CHAVE);
    if (j) return validarEstado(JSON.parse(j));
    const antigo = localStorage.getItem(CHAVE_ANTIGA);
    if (antigo) return migrarV1(JSON.parse(antigo));
  } catch (e) {}
  return null;
}

function exemplo(){
  const s = estadoInicial();
  s.fios = ["Descobrir quem incendiou o moinho"];
  s.personagens = ["Bento, o moleiro", "Irmã Odila, curandeira"];
  const t = agoraISO(), idEv = novoId();
  s.eventos = [{id: idEv, quando: t, cena: 1, origem: "oraculo", foco: "Um personagem age", explicacao: "Alguém já conhecido toma uma iniciativa própria.", personagem: "Irmã Odila, curandeira", acao: "Esconder", tema: "Segredo", rolagemFoco: 22, exemplo: true}];
  s.historico = [
    {id: novoId(), quando: t, cena: 1, tipo: "oraculo", titulo: "Exemplo: Oráculo", itens: [
      {rotulo: "Pergunta", valor: "Bento viu quem ateou o fogo?"},
      {rotulo: "Probabilidade", valor: "Provável · 65% com Caos 5"},
      {rotulo: "Resposta", valor: "SIM", dado: 100, resultado: 22}]},
    {id: novoId(), quando: t, cena: 1, tipo: "evento", titulo: "Exemplo: Evento aleatório (do oráculo)", eventoId: idEv, itens: [
      {rotulo: "Foco", valor: "Um personagem age", detalhe: "Alguém já conhecido toma uma iniciativa própria.", dado: 100, resultado: 22},
      {rotulo: "Personagem", valor: "Irmã Odila, curandeira"},
      {rotulo: "Ação", valor: "Esconder"}, {rotulo: "Tema", valor: "Segredo"}]},
    {id: novoId(), quando: t, cena: 1, tipo: "nota", titulo: "Anotação", itens: [], nota: "Bento viu alguém de capuz, e Odila parece estar escondendo algo sobre isso."}
  ];
  return s;
}

/* Registra qualquer coisa no histórico. */
function registrar(tipo, titulo, itens = [], extra = {}){
  const e = Object.assign({id: novoId(), quando: agoraISO(), cena: S.cena, tipo, titulo, itens}, extra);
  S.historico.push(e);
  if (S.historico.length > LIMITE_HISTORICO) S.historico.splice(0, S.historico.length - LIMITE_HISTORICO);
  salvar();
  if (typeof aoMudarHistorico === "function") aoMudarHistorico();
  return e;
}
/* Registra um evento aleatório na lista de eventos e no histórico. */
function registrarEvento(origem, ev, itens){
  const id = novoId();
  S.eventos.push(Object.assign({id, quando: agoraISO(), cena: S.cena, origem}, ev));
  return registrar("evento", "Evento aleatório" + (origem !== "manual" ? ` (${lowerFirst(ORIGENS[origem])})` : ""), itens, {eventoId: id});
}
function apagarRegistro(id){
  const e = S.historico.find(x => x.id === id);
  S.historico = S.historico.filter(x => x.id !== id);
  if (e && e.eventoId) S.eventos = S.eventos.filter(x => x.id !== e.eventoId);
  salvar();
}

/* ---------- JSON da sessão ---------- */
function sessaoComoObjeto(){
  return {
    formato: FORMATO,
    versao: VERSAO,
    exportadoEm: agoraISO(),
    estado: {
      caos: S.caos, cena: S.cena, modoDados: S.modo, genero: S.genero, probabilidade: S.prob,
      nivelMonstro: S.nivelMonstro, cenaEsperada: S.cenaEsperada, fios: S.fios, personagens: S.personagens
    },
    eventos: S.eventos,
    historico: S.historico
  };
}
function sessaoComoJSON(){ return JSON.stringify(sessaoComoObjeto(), null, 2); }

const inteiro = (v, padrao) => Number.isInteger(+v) && v !== "" && v !== null ? +v : padrao;
const listaDeTextos = a => Array.isArray(a) ? a.filter(x => typeof x === "string" && x.trim()).map(x => x.slice(0, 300)) : [];

function limparItens(itens){
  if (!Array.isArray(itens)) return [];
  return itens.filter(i => i && typeof i === "object").map(i => {
    const o = {rotulo: String(i.rotulo ?? ""), valor: String(i.valor ?? "")};
    if (i.detalhe) o.detalhe = String(i.detalhe);
    if (i.dado) { o.dado = inteiro(i.dado, undefined); o.resultado = inteiro(i.resultado, undefined); }
    if (i.dados) o.dados = String(i.dados);
    return o;
  });
}
/* Lê um texto JSON e devolve um estado válido, ou lança um erro explicando o problema. */
function lerSessao(texto){
  let o;
  try { o = JSON.parse(texto); } catch (e) { throw new Error("O arquivo não é um JSON válido."); }
  if (!o || typeof o !== "object" || Array.isArray(o)) throw new Error("O JSON precisa ser um objeto com estado, eventos e historico.");
  if (o.formato && o.formato !== FORMATO) throw new Error("Este JSON não é uma sessão do Mestre Solo.");
  if (!Array.isArray(o.historico)) throw new Error("O arquivo não tem a lista \"historico\".");
  const e = o.estado || {};
  return validarEstado({
    caos: e.caos, cena: e.cena, modo: e.modoDados, genero: e.genero, prob: e.probabilidade,
    nivelMonstro: e.nivelMonstro, cenaEsperada: e.cenaEsperada, fios: e.fios, personagens: e.personagens,
    eventos: o.eventos, historico: o.historico
  });
}
function validarEstado(o){
  const s = estadoInicial();
  s.caos = clamp(inteiro(o.caos, 5), 1, 9);
  s.cena = Math.max(1, inteiro(o.cena, 1));
  s.modo = o.modo === "manual" ? "manual" : "site";
  s.genero = G[o.genero] ? o.genero : "fantasia";
  s.prob = clamp(inteiro(o.prob, 4), 0, LIK.length - 1);
  s.nivelMonstro = clamp(inteiro(o.nivelMonstro, 0), 0, 10);
  s.cenaEsperada = String(o.cenaEsperada ?? "");
  s.fios = listaDeTextos(o.fios);
  s.personagens = listaDeTextos(o.personagens);
  s.eventos = Array.isArray(o.eventos) ? o.eventos.filter(x => x && typeof x === "object").map(x => ({
    id: String(x.id || novoId()), quando: String(x.quando || agoraISO()), cena: Math.max(1, inteiro(x.cena, 1)),
    origem: ORIGENS[x.origem] ? x.origem : "manual", foco: String(x.foco ?? ""), explicacao: String(x.explicacao ?? ""),
    acao: String(x.acao ?? ""), tema: String(x.tema ?? ""),
    ...(x.personagem ? {personagem: String(x.personagem)} : {}), ...(x.fio ? {fio: String(x.fio)} : {}),
    ...(x.rolagemFoco ? {rolagemFoco: inteiro(x.rolagemFoco, undefined)} : {})
  })) : [];
  s.historico = (Array.isArray(o.historico) ? o.historico : []).filter(h => h && typeof h === "object").map(h => {
    const r = {
      id: String(h.id || novoId()), quando: String(h.quando || agoraISO()), cena: Math.max(1, inteiro(h.cena, 1)),
      tipo: TIPOS[h.tipo] ? h.tipo : "nota", titulo: String(h.titulo ?? ""), itens: limparItens(h.itens)
    };
    if (h.nota) r.nota = String(h.nota);
    if (h.eventoId) r.eventoId = String(h.eventoId);
    return r;
  }).slice(-LIMITE_HISTORICO);
  return s;
}

/* Converte o salvamento da primeira versão do site. */
function migrarV1(o){
  const tipoPorTitulo = t => {
    t = String(t || "");
    if (t.startsWith("Oráculo")) return "oraculo";
    if (t.startsWith("Cena") || t.startsWith("Fim da cena")) return "cena";
    if (t.startsWith("Rolagem")) return "dado";
    if (t.startsWith("Aventura")) return "aventura";
    if (t.startsWith("Monstro")) return "monstro";
    if (t.includes("sorteado")) return "lista";
    return "inspiracao";
  };
  const agora = agoraISO();
  return validarEstado({
    caos: o.cf, cena: o.scene, modo: o.mode === "user" ? "manual" : "site", genero: o.genre, prob: o.lik,
    nivelMonstro: o.mlevel, cenaEsperada: o.sceneText, fios: o.threads, personagens: o.npcs, eventos: [],
    historico: (o.log || []).slice().reverse().filter(e => !String(e.title).startsWith("Exemplo")).map(e => ({
      quando: agora, cena: e.scene,
      tipo: e.kind === "ev" ? "evento" : e.kind === "note" ? "nota" : tipoPorTitulo(e.title),
      titulo: e.title, nota: e.note,
      itens: (e.items || []).map(it => ({rotulo: it.k, valor: it.v, detalhe: it.x, dado: it.d, resultado: it.r, dados: it.dice}))
    }))
  });
}
