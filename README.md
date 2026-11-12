# Mestre Solo

Um mestre de jogo virtual para jogar RPG sozinho, inspirado na ideia do *Mythic Game Master Emulator*. Roda direto no navegador: HTML, CSS e JavaScript puros, sem instalação, sem build e sem dependências.

## Funcionalidades

- **Oráculo de sim ou não** com 9 níveis de probabilidade e **Fator de Caos** (1 a 9). Respostas excepcionais e eventos aleatórios quando o d100 sai com dígitos repetidos (11, 22… 99) e o dígito é menor ou igual ao Caos.
- **Cenas:** teste da cena esperada com d10 contra o Caos (como esperada, alterada ou interrompida) e ajuste do Caos ao fim de cada cena.
- **Eventos aleatórios:** foco do evento + Ação + Tema, puxando fios e personagens das suas listas.
- **Tabelas de inspiração:** Ação, Tema, descritores, local, objeto, personagem rápido, reação de personagem (2d6), clima, tesouro, obstáculo e nomes, com as faixas de cada resultado para quem rola dados físicos.
- **Rolador de dados:** d4 a d100 e expressões como `2d6+3`, `d20-1`, `4d6kh3`, `2d20kl1`.
- **Gerador de aventuras** (fantasia, horror, ficção científica) com roteiro em cinco cenas.
- **Gerador de monstros** com aparência, poderes, fraqueza, comportamento e ficha genérica por nível de ameaça.
- **Histórico da sessão** (aba própria e botão no topo): tudo agrupado por cena, com filtros por tipo, busca, contadores, cópia em texto e **exportar/importar em JSON**.
- **Dois modos de dados:** o site rola, ou você rola seus dados físicos e digita o resultado.
- Tema claro e escuro automático.

## Estrutura

```
mestre-solo/
├── index.html                  # estrutura da página
├── css/
│   └── style.css               # visual (cores, tipografia, layout, tema escuro)
├── js/
│   ├── util.js                 # funções auxiliares ($, esc, datas, copiar)
│   ├── tabelas.js              # TODAS as tabelas: edite aqui para criar as suas
│   ├── estado.js               # estado da sessão, salvamento e formato JSON
│   ├── dados.js                # rolagens, modo "Eu rolo", sorteio em tabelas, expressões
│   ├── historico.js            # aba Histórico, diário lateral, exportar/importar JSON
│   └── app.js                  # oráculo, cenas, geradores, listas e inicialização
├── exemplos/
│   └── sessao-exemplo.json     # exemplo do formato do arquivo de sessão
└── README.md
```

Os scripts são carregados em ordem pelo `index.html` como scripts comuns (não módulos), então o site funciona também ao abrir o `index.html` direto do computador, sem servidor.

## Onde ficam os eventos e o histórico

Durante o jogo, a sessão é salva automaticamente no navegador (`localStorage`). Para guardar de verdade, levar para outro aparelho ou versionar no GitHub, use a aba **Histórico**:

- **Baixar JSON**: salva um arquivo `mestre-solo-sessao-AAAA-MM-DD-HHMM.json`.
- **Copiar JSON**: copia o mesmo conteúdo para colar onde quiser.
- **Carregar JSON**: abre um arquivo salvo e substitui a sessão atual (pede confirmação).

### Formato do arquivo

```json
{
  "formato": "mestre-solo/sessao",
  "versao": 1,
  "exportadoEm": "2026-11-12T21:21:15.532Z",
  "estado": {
    "caos": 5, "cena": 1, "modoDados": "site", "genero": "fantasia",
    "probabilidade": 4, "nivelMonstro": 0, "cenaEsperada": "",
    "fios": ["Descobrir quem incendiou o moinho"],
    "personagens": ["Bento, o moleiro"]
  },
  "eventos": [
    { "id": "…", "quando": "ISO 8601", "cena": 1, "origem": "oraculo | cena | manual",
      "foco": "Um personagem age", "explicacao": "…", "personagem": "…", "fio": "…",
      "acao": "Esconder", "tema": "Segredo", "rolagemFoco": 22 }
  ],
  "historico": [
    { "id": "…", "quando": "ISO 8601", "cena": 1, "tipo": "oraculo",
      "titulo": "Oráculo",
      "itens": [ { "rotulo": "Resposta", "valor": "SIM", "dado": 100, "resultado": 22 } ],
      "nota": "só em anotações", "eventoId": "só em eventos" }
  ]
}
```

- `eventos` guarda cada evento aleatório de forma estruturada (foco, ação, tema, personagem, fio).
- `historico` guarda tudo em ordem cronológica. Tipos possíveis: `oraculo`, `evento`, `cena`, `inspiracao`, `dado`, `aventura`, `monstro`, `lista`, `nota`. Registros de evento apontam para o evento pelo `eventoId`.
- `itens` traz o rótulo, o valor e, quando houve rolagem, o dado (`dado`, `resultado`) ou um texto (`dados`, como `"2d6 · 8"`).

Veja um arquivo completo em `exemplos/sessao-exemplo.json`.

## Como usar localmente

Abra o `index.html` no navegador.

## Personalizar tabelas

Abra `js/tabelas.js`. As tabelas gerais ficam em `T` e as que mudam por gênero em `G`. Listas com 2, 3, 4, 6, 8, 10, 12, 20 ou 100 itens usam o dado correspondente; outros tamanhos (até 100) são mapeados em faixas de d100, mostradas na aba Tabelas. Para uma tabela nova aparecer na aba Tabelas, acrescente-a também em `TABLE_INFO`.

## Créditos

Inspirado no conceito do *Mythic Game Master Emulator*, de Tana Pigeon (Word Mill Games). Todas as tabelas e regras deste projeto são originais e não reproduzem o conteúdo do livro.
