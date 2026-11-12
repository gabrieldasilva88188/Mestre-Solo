"use strict";
/* Rolagens: o site rola ou pede o resultado ao jogador (modo "Eu rolo"). */

function rng(n){ const a = new Uint32Array(1); crypto.getRandomValues(a); return (a[0] % n) + 1; }
function rolarAuto(qtd, faces){ return Array.from({length: qtd}, () => rng(faces)); }

/* Um "lote" agrupa as rolagens de uma ação (ex.: gerar uma aventura),
   para o botão "Rolar o resto por mim" valer até o fim dela. */
let lote = null;
async function emLote(fn){ lote = {auto: false}; try { return await fn(); } finally { lote = null; } }

async function roll(qtd, faces, rotulo, opts = {}){
  if (S.modo === "site" || (lote && lote.auto) || opts.auto) return rolarAuto(qtd, faces);
  return pedirResultado(qtd, faces, rotulo, opts);
}

function pedirResultado(qtd, faces, rotulo, opts){
  return new Promise((resolve, reject) => {
    const ov = $("#ov"), inp = $("#mIn"), err = $("#mErr");
    $("#mDie").textContent = (qtd > 1 ? qtd : "") + "d" + faces;
    $("#mLabel").textContent = rotulo;
    let dica;
    if (qtd > 1) dica = opts.cada ? `Digite os ${qtd} valores separados por espaço.` : `Digite os ${qtd} valores separados por espaço, ou só o total.`;
    else if (faces === 100) dica = "Digite de 1 a 100. 00 conta como 100.";
    else if (faces === 10) dica = "Digite de 1 a 10. 0 conta como 10.";
    else dica = `Digite de 1 a ${faces}.`;
    $("#mHint").textContent = dica;
    inp.value = ""; err.textContent = "";
    $("#mRest").hidden = !lote;
    ov.classList.add("open");
    setTimeout(() => inp.focus(), 30);

    const fechar = () => { ov.classList.remove("open"); desligar(); };
    const ajusta = n => (n === 0 && (faces === 100 || faces === 10)) ? faces : n;
    const ok = () => {
      const nums = (inp.value.match(/\d+/g) || []).map(Number).map(ajusta);
      if (!nums.length){ err.textContent = "Digite o resultado do dado."; return; }
      if (nums.length === qtd){
        if (nums.some(n => n < 1 || n > faces)){ err.textContent = `Cada valor precisa estar entre 1 e ${faces}.`; return; }
        fechar(); resolve(nums); return;
      }
      if (qtd > 1 && nums.length === 1 && !opts.cada){
        const t = nums[0];
        if (t < qtd || t > qtd * faces){ err.textContent = `O total de ${qtd}d${faces} vai de ${qtd} a ${qtd * faces}.`; return; }
        const a = [t]; a.soTotal = true; fechar(); resolve(a); return;
      }
      err.textContent = qtd === 1 ? "Digite só um número." : `Digite exatamente ${qtd} valores${opts.cada ? "" : " ou o total"}.`;
    };
    const auto = () => { fechar(); resolve(rolarAuto(qtd, faces)); };
    const resto = () => { if (lote) lote.auto = true; auto(); };
    const cancelar = () => { fechar(); reject(new Error("cancel")); };
    const tecla = e => { if (e.key === "Enter"){ e.preventDefault(); ok(); } else if (e.key === "Escape"){ cancelar(); } };
    const mapa = [["#mOk", ok], ["#mAuto", auto], ["#mRest", resto], ["#mCancel", cancelar]];
    mapa.forEach(([s, f]) => $(s).addEventListener("click", f));
    inp.addEventListener("keydown", tecla);
    function desligar(){ mapa.forEach(([s, f]) => $(s).removeEventListener("click", f)); inp.removeEventListener("keydown", tecla); }
  });
}

/* ---------- Tabelas ---------- */
const STD = [2, 3, 4, 6, 8, 10, 12, 20, 100];
function dadoPara(n){ return STD.includes(n) ? n : 100; }
async function pick(tabela, rotulo){
  const n = tabela.length, d = dadoPara(n);
  const [r] = await roll(1, d, `${rotulo} (d${d})`);
  const i = d === n ? r - 1 : Math.floor((r - 1) * n / 100);
  return {v: tabela[i], d, r};
}
/* Sorteia de uma lista do jogador (fios, personagens). Rerrola se passar do tamanho. */
async function pickList(lista, rotulo){
  const n = lista.length;
  if (n === 1) return {v: lista[0]};
  if (n > 100) return pick(lista, rotulo);
  const d = STD.find(x => x >= n);
  for (;;){
    const [r] = await roll(1, d, `${rotulo} (d${d}${d > n ? `, role de novo se passar de ${n}` : ""})`);
    if (r <= n) return {v: lista[r - 1], d, r};
  }
}
function faixas(n){
  const d = dadoPara(n);
  if (d === n) return Array.from({length: n}, (_, i) => String(i + 1));
  const f = x => String(x).padStart(2, "0");
  const out = [];
  for (let i = 0; i < n; i++){
    let lo = null, hi = null;
    for (let r = 1; r <= 100; r++){ if (Math.floor((r - 1) * n / 100) === i){ if (lo === null) lo = r; hi = r; } }
    out.push(lo === hi ? f(lo) : `${f(lo)}–${f(hi)}`);
  }
  return out;
}

/* ---------- Nomes (sempre sorteados pelo site) ---------- */
const qualquer = a => a[rng(a.length) - 1];
function gerarNome(){ return cap((qualquer(NS.a) + qualquer(NS.b) + qualquer(NS.c)).toLowerCase()); }
function gerarNomeMonstro(){ return cap((qualquer(MS.a) + qualquer(MS.b) + qualquer(MS.c)).toLowerCase()); }

/* ---------- Expressões de dados ---------- */
function lerExpressao(str){
  const s = str.replace(/\s+/g, "").toLowerCase().replace(/d%/g, "d100");
  const ruim = `Não entendi “${str}”. Use algo como 2d6+3, d20 ou 4d6kh3.`;
  if (!s) throw new Error("Digite uma expressão, como 2d6+3.");
  const re = /([+-])?(?:(\d*)d(\d+)(?:(kh|kl)(\d+))?|(\d+))/y;
  const termos = []; let i = 0;
  while (i < s.length){
    re.lastIndex = i; const m = re.exec(s);
    if (!m || m[0] === "" || (i > 0 && !m[1])) throw new Error(ruim);
    const sinal = m[1] === "-" ? -1 : 1;
    if (m[3]){
      const n = m[2] ? +m[2] : 1, d = +m[3];
      if (n < 1 || n > 100) throw new Error("Use de 1 a 100 dados por grupo.");
      if (d < 2 || d > 1000) throw new Error("Os dados precisam ter de 2 a 1000 faces.");
      const k = m[5] ? +m[5] : null;
      if (m[4] && (k < 1 || k > n)) throw new Error(`Em ${n}d${d}${m[4]}${k}, mantenha entre 1 e ${n} dados.`);
      termos.push({tipo: "dados", sinal, n, d, manter: m[4] || null, k});
    } else termos.push({tipo: "num", sinal, v: +m[6]});
    i = re.lastIndex;
  }
  return termos;
}
async function rolarExpressao(str){
  const termos = lerExpressao(str);
  let total = 0; const partes = [];
  for (const t of termos){
    const pre = partes.length ? (t.sinal < 0 ? "− " : "+ ") : (t.sinal < 0 ? "−" : "");
    if (t.tipo === "num"){ total += t.sinal * t.v; partes.push(pre + t.v); continue; }
    const nome = `${t.n}d${t.d}${t.manter ? t.manter + t.k : ""}`;
    const vals = await roll(t.n, t.d, `Role ${nome}`, {cada: !!t.manter});
    let sub, desc;
    if (vals.soTotal){ sub = vals[0]; desc = `${nome} [total ${sub}]`; }
    else {
      const arr = vals.map((v, i) => ({v, i, fora: false}));
      if (t.manter){
        const ord = [...arr].sort((a, b) => t.manter === "kh" ? b.v - a.v : a.v - b.v);
        const fica = new Set(ord.slice(0, t.k).map(o => o.i));
        arr.forEach(o => o.fora = !fica.has(o.i));
      }
      sub = arr.filter(o => !o.fora).reduce((a, o) => a + o.v, 0);
      desc = `${nome} [${arr.map(o => o.fora ? `(${o.v})` : o.v).join(", ")}]`;
    }
    total += t.sinal * sub; partes.push(pre + desc);
  }
  return {total, detalhe: partes.join(" ")};
}
