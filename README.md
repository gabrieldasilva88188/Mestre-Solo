# Mestre Solo

Um mestre de jogo virtual para jogar RPG sozinho, inspirado na ideia do *Mythic Game Master Emulator*. Roda direto no navegador: é uma única página HTML, sem instalação, sem servidor e sem dependências.

## Funcionalidades

- **Oráculo de sim ou não** com 9 níveis de probabilidade e **Fator de Caos** (1 a 9). Respostas excepcionais e eventos aleatórios quando o d100 sai com dígitos repetidos (11, 22… 99) e o dígito é menor ou igual ao Caos.
- **Cenas:** teste da cena esperada com d10 contra o Caos (como esperada, alterada ou interrompida) e ajuste do Caos ao fim de cada cena.
- **Eventos aleatórios:** foco do evento + Ação + Tema, puxando fios e personagens das suas listas.
- **Tabelas de inspiração:** Ação, Tema, descritores, local, objeto, personagem rápido, reação de personagem (2d6), clima, tesouro, obstáculo e nomes. Todas exibem as faixas para quem rola dados físicos.
- **Rolador de dados:** d4 a d100 e expressões como `2d6+3`, `d20-1`, `4d6kh3`, `2d20kl1`.
- **Gerador de aventuras** (fantasia, horror, ficção científica): gancho, contratante, objetivo, local, antagonista, complicação, reviravolta, recompensa, prazo e roteiro em cinco cenas.
- **Gerador de monstros:** aparência, ataque, habilidade, fraqueza, comportamento, habitat, desejo, sinais, despojos e uma ficha genérica escalada pelo nível de ameaça.
- **Fios, personagens e diário** com sorteio, anotações e cópia do diário em texto.
- **Dois modos de dados:** o site rola, ou você rola seus dados físicos e digita o resultado.
- Tema claro e escuro automático, de acordo com o sistema.

O progresso (diário, listas, Caos, cena atual) fica salvo no `localStorage` do navegador.

## Como usar localmente

Baixe o projeto e abra o arquivo `index.html` no navegador. Só isso.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo, `mestre-solo`).
2. Envie os arquivos deste projeto para a branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Primeira versão do Mestre Solo"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/mestre-solo.git
   git push -u origin main
   ```
3. No repositório, vá em **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**, selecione `main` e a pasta `/ (root)`, e salve.
5. Em um ou dois minutos o site estará em `https://SEU-USUARIO.github.io/mestre-solo/`.

## Estrutura

```
mestre-solo/
├── index.html   # todo o site: HTML, CSS, JavaScript e tabelas
└── README.md
```

As tabelas ficam no objeto `T` (gerais) e `G` (por gênero) dentro do `<script>` do `index.html`. Para criar suas próprias tabelas, basta editar ou acrescentar listas ali. Listas com 2, 3, 4, 6, 8, 10, 12, 20 ou 100 itens usam o dado correspondente; outros tamanhos são mapeados em d100 (até 100 itens).

## Créditos

Inspirado no conceito do *Mythic Game Master Emulator*, de Tana Pigeon (Word Mill Games). Todas as tabelas e regras deste projeto são originais e não reproduzem o conteúdo do livro.
