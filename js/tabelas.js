"use strict";
/* Todas as tabelas do Mestre Solo. Edite ou acrescente listas aqui.
   Listas com 2, 3, 4, 6, 8, 10, 12, 20 ou 100 itens usam o dado correspondente;
   outros tamanhos (até 100) são mapeados em faixas de d100. */

const T = {
  acao: ["Abandonar","Abrir","Acusar","Adiar","Ajudar","Alertar","Aliar-se","Alterar","Ameaçar","Aprisionar",
    "Arriscar","Atacar","Atrair","Banir","Barganhar","Bloquear","Buscar","Capturar","Celebrar","Cercar",
    "Chamar","Comandar","Compartilhar","Competir","Confessar","Confrontar","Confundir","Conquistar","Construir","Contaminar",
    "Controlar","Corromper","Criar","Cuidar","Curar","Decepcionar","Defender","Desafiar","Descobrir","Desmascarar",
    "Despertar","Destruir","Desviar","Disfarçar","Dividir","Dominar","Duvidar","Enganar","Enfraquecer","Ensinar",
    "Enterrar","Entregar","Envenenar","Escapar","Esconder","Espionar","Esquecer","Explorar","Expor","Falhar",
    "Fortalecer","Fugir","Guiar","Herdar","Humilhar","Ignorar","Imitar","Inspirar","Investigar","Invadir",
    "Isolar","Julgar","Libertar","Lembrar","Manipular","Mentir","Mover","Negociar","Oferecer","Perder",
    "Perdoar","Perseguir","Possuir","Proteger","Provocar","Purificar","Questionar","Quebrar","Reconciliar","Recrutar",
    "Recusar","Resgatar","Revelar","Roubar","Sabotar","Sacrificar","Seguir","Silenciar","Transformar","Trair"],
  tema: ["Aliança","Ambição","Amizade","Amor","Ancestral","Arma","Armadilha","Autoridade","Batalha","Beleza",
    "Bênção","Caminho","Caos","Castigo","Cidade","Ciúme","Conhecimento","Conflito","Coragem","Corrupção",
    "Crença","Crime","Culpa","Cura","Dádiva","Dever","Desejo","Destino","Dinheiro","Doença",
    "Dor","Engano","Escuridão","Esperança","Estrangeiro","Exílio","Fama","Família","Fé","Fome",
    "Fronteira","Fuga","Futuro","Guerra","Herança","Honra","Identidade","Inimigo","Inocência","Inveja",
    "Jornada","Juramento","Justiça","Lar","Lealdade","Lenda","Liberdade","Liderança","Loucura","Luz",
    "Magia","Mapa","Medo","Memória","Mensagem","Mentira","Mistério","Monstro","Morte","Natureza",
    "Notícia","Obsessão","Orgulho","Ouro","Paz","Passado","Perigo","Poder","Portal","Preço",
    "Prisão","Profecia","Promessa","Recompensa","Refúgio","Relíquia","Ruína","Sangue","Segredo","Sobrevivência",
    "Sonho","Tempo","Tecnologia","Tesouro","Tradição","Traição","Verdade","Viagem","Vingança","Vida"],
  adjetivo: ["Antigo","Ameaçador","Abandonado","Belo","Brilhante","Barulhento","Calmo","Caótico","Colossal","Comum",
    "Corrompido","Cruel","Delicado","Desconhecido","Desolado","Elegante","Enorme","Escondido","Estranho","Exótico",
    "Familiar","Feroz","Frágil","Frio","Gentil","Gasto","Grotesco","Hostil","Imponente","Inquieto",
    "Leal","Lento","Luxuoso","Majestoso","Misterioso","Molhado","Mórbido","Novo","Movimentado","Pacífico",
    "Perigoso","Pesado","Pequeno","Podre","Poderoso","Quente","Quebrado","Rápido","Raro","Rústico",
    "Sagrado","Selvagem","Silencioso","Simples","Sombrio","Sujo","Tenso","Úmido","Vazio","Vibrante"],
  modo: ["Agressivamente","Alegremente","Ansiosamente","Bruscamente","Calmamente","Cautelosamente","Cruelmente","Desajeitadamente","Desesperadamente","Discretamente",
    "Elegantemente","Estranhamente","Friamente","Furiosamente","Gentilmente","Habilmente","Lentamente","Loucamente","Misteriosamente","Nervosamente",
    "Orgulhosamente","Pacientemente","Rapidamente","Ruidosamente","Secretamente","Silenciosamente","Solenemente","Teimosamente","Tristemente","Violentamente"],
  local: ["Taverna","Mercado","Templo","Ruínas","Floresta","Caverna","Porto","Ponte","Torre","Cemitério",
    "Biblioteca","Pântano","Estrada","Acampamento","Mansão","Esgoto","Mina","Fortaleza","Vila","Deserto"],
  objeto: ["Chave","Carta lacrada","Mapa rasgado","Amuleto","Lâmina quebrada","Livro sem título","Frasco lacrado","Moeda estranha","Máscara","Anel",
    "Diário","Pequena estátua","Corda","Lanterna","Coroa","Osso entalhado","Espelho","Sino","Retrato","Caixa trancada"],
  profissao: ["Ferreiro","Mercador","Sacerdotisa","Guarda","Ladra","Erudito","Caçadora","Marinheiro","Curandeira","Nobre",
    "Mendigo","Barda","Soldado","Contrabandista","Fazendeira","Alquimista","Mensageiro","Cartógrafa","Estalajadeira","Mercenário"],
  traco: ["Desconfiado","Generoso","Ganancioso","Nervoso","Arrogante","Leal","Curioso","Exausto","Alegre","Rancoroso",
    "Supersticioso","Corajoso","Covarde","Sarcástico","Gentil","Ambicioso","Distraído","Honesto","Mentiroso","Reservado"],
  motivacao: ["Riqueza","Vingança","Proteger alguém","Conhecimento","Poder","Redenção","Fama","Sobreviver","Amor","Fé","Liberdade","Dever"],
  clima: ["Céu limpo","Nublado","Garoa fina","Chuva forte","Tempestade com raios","Neblina densa","Vento cortante","Calor sufocante","Frio intenso","Neve","Granizo","Fenômeno estranho no céu"],
  tesouro: ["Bolsa de moedas","Gema bruta","Arma de ótima qualidade","Poção desconhecida","Pergaminho","Mapa para outro tesouro","Joia de família","Informação valiosa","Favor de alguém poderoso","Artefato amaldiçoado","Ferramenta rara","A chave de algo maior"],
  alteracao: ["Um personagem importante não está onde deveria","O lugar mudou: danificado, ocupado ou diferente","Alguém chegou antes de você","Há uma testemunha inesperada","Você tem menos tempo do que pensava","Um obstáculo novo bloqueia o caminho","Tudo está mais calmo do que o esperado","Tudo está mais perigoso do que o esperado","Um aliado aparece","Interprete a mudança com Ação + Tema"],
  obstaculo: ["Um guardião","Uma porta trancada","Um terreno perigoso","Uma multidão hostil","Uma armadilha","Uma criatura territorial","Um enigma","Uma negociação difícil","Uma perseguição","Um dilema moral"],
  gancho: ["Um pedido de ajuda chega por carta","Um estranho morre diante de você","Você acorda sem lembrar da noite anterior","Uma recompensa é anunciada na praça","Um velho amigo aparece ferido","Você testemunha um crime","Algo seu foi roubado","Uma profecia menciona seu nome","Uma criatura aparece onde não deveria","Você herda algo inesperado","Alguém encapuzado oferece um contrato","O lugar onde você está é atacado"],
  patrono: ["Um nobre decadente","Uma ordem religiosa","Uma guilda de mercadores","Uma criança órfã","Um erudito obcecado","Uma bruxa da floresta","O conselho da cidade","Um criminoso arrependido","Um espírito inquieto","Ninguém: é pessoal"],
  objetivo: ["Resgatar alguém","Recuperar um objeto","Escoltar uma pessoa ou carga","Investigar um desaparecimento","Destruir uma ameaça","Entregar uma mensagem","Explorar um lugar desconhecido","Proteger um local até o amanhecer","Descobrir a verdade sobre um crime","Impedir um ritual ou plano","Negociar uma trégua","Capturar alguém com vida"],
  complicacao: ["Um aliado tem uma agenda oculta","O tempo é curto","O objetivo não é o que parece","Uma terceira facção quer a mesma coisa","O caminho principal está bloqueado","Você é acusado de algo","O contratante mente","Um inocente está no fogo cruzado","Os recursos são escassos","O clima piora muito","Uma ferida ou maldição atrapalha","O antagonista conhece você"],
  reviravolta: ["O antagonista é parente de alguém importante","O contratante é o verdadeiro vilão","A vítima não quer ser salva","O objeto procurado é falso","O antagonista tenta impedir algo pior","Há um traidor entre os aliados","O local é uma armadilha preparada","Tudo faz parte de um plano maior","O antagonista original já morreu e outro assumiu","Você já esteve aqui antes"],
  pressao: ["Antes do anoitecer","Em três dias","Antes da próxima lua cheia","Antes que um rival chegue","Enquanto a tempestade durar","Antes que a doença se espalhe","Sem prazo, mas alguém observa","Agora mesmo"],
  tamanho: ["Minúsculo (cabe na mão)","Pequeno (como um cão)","Médio (como uma pessoa)","Grande (como um cavalo)","Enorme (como uma casa)","Colossal (como uma torre)"],
  forma: ["um inseto","um réptil","um felino","uma ave","um humanoide","um polvo","um verme","uma aranha","um lobo","um peixe",
    "um fungo","uma planta","uma massa amorfa","um constructo","um cadáver","uma sombra","um cristal vivo","um anfíbio","um morcego","uma quimera"],
  tracoMonstro: ["muitos olhos","uma carapaça de ossos","pele translúcida","chifres retorcidos","uma boca vertical","brilho bioluminescente","penas negras","nenhum rosto","membros extras","o corpo coberto de musgo",
    "uma voz quase humana","espinhos pelo corpo","fumaça saindo da pele","uma máscara de casca de árvore","dentes de vidro","um cheiro doce","partes de metal","pele gelada ao toque","uma cauda preênsil","os pés virados para trás"],
  locomocao: ["Anda sobre quatro patas","Rasteja","Voa","Nada","Salta longas distâncias","Escala paredes e tetos","Flutua sem tocar o chão","Escava por baixo da terra"],
  ataque: ["Mordida","Garras","Ferrão venenoso","Esmagamento","Tentáculos que agarram","Cuspe ácido","Grito atordoante","Chifrada","Cauda como chicote","Toque gélido","Espinhos disparados","Engolir a presa inteira"],
  habilidade: ["Fica invisível no escuro","Regenera ferimentos","Imita vozes","Paralisa com o olhar","Divide-se ao ser ferido","Controla animais menores","Causa medo sobrenatural","Atravessa paredes","Explode ao morrer","Drena memórias",
    "Muda de forma","Teleporte curto","Sopro de fogo ou gelo","Tece teias","Hipnotiza","Camuflagem perfeita","Imune a armas comuns","Comanda os mortos","Sente o medo das presas","Corrói metal com o toque"],
  fraqueza: ["Luz do sol","Prata","Fogo","Sal","Música","Água corrente","Seu nome verdadeiro","Ferro frio","Barulho alto","Um objeto específico","Pode ser enganado facilmente","O próprio reflexo"],
  comportamento: ["Caça em bando","Embosca as presas","Territorial","Curioso","Covarde: foge se ferido","Brinca com a presa","Protege um ninho","Faminto e desesperado","Inteligente e disposto a negociar","Obedece a um mestre","Dorme até ser perturbado","Imprevisível"],
  habitat: ["Cavernas profundas","Pântanos","Ruínas","Florestas densas","Esgotos","Montanhas","Mar aberto","Desertos","Cemitérios","Céus tempestuosos","Entre as pessoas, disfarçado","Outro plano de existência"],
  desejo: ["Comer","Proteger sua cria","Vingar-se de quem o criou","Voltar para casa","Colecionar objetos brilhantes","Ser adorado","Destruir um lugar específico","Encontrar um par","Terminar uma tarefa antiga","Nada: apenas existe"],
  sinal: ["Cheiro de enxofre","Marcas de garras no alto das paredes","Animais em silêncio","Ossos limpos empilhados","Frio repentino","Luzes estranhas à noite","Rastros que somem do nada","Gosma brilhante","Sussurros","Plantas murchas ao redor"],
  despojo: ["Glândula de veneno valiosa","Couro resistente","Dentes para amuletos","Uma gema no estômago","Pertences de vítimas antigas","Sangue usado em poções","Um olho que vê no escuro","Nada: se desfaz em pó","Um ovo","Uma pista sobre sua origem"],
  origem: ["Natural: evoluiu assim","Criado por magia ou ciência","Uma pessoa amaldiçoada","Veio de outro mundo","Despertou de um sono antigo","Nasceu de um desastre","Foi invocado por alguém","Ninguém sabe"],
  epiteto: ["o Devorador","a Que Sussurra","o Faminto","a Sem Rosto","o Rei do Lodo","a Mãe das Larvas","o Andarilho da Névoa","o Velho Dente","a Viúva Pálida","o Que Espera","o Ossudo","a Chama Fria"]
};
const G = {
  fantasia: {
    local: ["Uma torre de mago abandonada","Uma mina anã inundada","Um mosteiro na montanha","Uma floresta de onde ninguém volta","Ruínas de um império antigo","Uma cidade portuária corrupta","Um castelo sitiado","Uma ilha que surge na neblina","Catacumbas sob a catedral","Um vale de gigantes adormecidos","Um mercado subterrâneo","Uma ponte sobre um abismo"],
    antagonista: ["Um necromante exilado","Um dragão jovem e ambicioso","Um culto a um deus esquecido","Um barão tirano","Uma fada ressentida","Um bando de orcs desesperados","Um cavaleiro caído","Um lich que quer ser lembrado","Uma guilda de assassinos","Um troll que cobra pedágio","Um feiticeiro de sangue","Uma rainha usurpadora"],
    recompensa: ["Ouro e gemas","Uma arma encantada","Um título de nobreza","Um grimório","Um aliado leal","Um pedaço de terra","Um mapa antigo","Um favor real","Uma montaria rara","Um segredo arcano"]
  },
  horror: {
    local: ["Um hospital desativado","Uma casa de fazenda isolada","Uma igreja cujo sino toca sozinho","Um hotel à beira da estrada","Uma vila de pescadores silenciosa","Um orfanato antigo","Um túnel de metrô fechado","Um farol na costa","Uma floresta com marcas nas árvores","Um porão sem fundo","Um parque de diversões abandonado","Uma escola à noite"],
    antagonista: ["Uma entidade que imita vozes","Um assassino que nunca é visto","Uma família com um segredo antigo","Um médico com experimentos proibidos","Uma seita local","Um fantasma preso a uma promessa","Algo que vive dentro das paredes","Uma criança que não envelhece","Uma criatura do lago","Um pacto que veio cobrar a dívida","Um vizinho gentil demais","A própria casa"],
    recompensa: ["Sobreviver","A verdade","Um objeto protetor","Salvar quem você ama","Um diário com respostas","Uma herança em dinheiro","A paz de um espírito","Uma pista para o próximo horror","Esquecer o que viu","Um aliado improvável"]
  },
  scifi: {
    local: ["Uma estação orbital à deriva","Uma colônia em uma lua gelada","Uma nave cargueira sem tripulação","Um laboratório corporativo subterrâneo","Uma megacidade em apagão","Um planeta desértico com ruínas alienígenas","Um asteroide de mineração","Uma arcologia em quarentena","Um cemitério de naves","Uma base de pesquisa no fundo do oceano","Um anel habitacional em revolta","Um posto avançado na fronteira"],
    antagonista: ["Uma IA que reescreveu as próprias diretrizes","Uma executiva corporativa implacável","Piratas espaciais","Um organismo alienígena adaptável","Um senhor da guerra ciborgue","Clones rebeldes","Um culto tecnológico","Um caçador de recompensas","Uma praga de nanomáquinas","Uma junta militar","Um sindicato do crime","Uma frota de drones automatizados"],
    recompensa: ["Créditos","Uma nave própria","Dados corporativos","Implantes cibernéticos","Uma licença de voo","Coordenadas secretas","Armamento experimental","Perdão de dívidas","Um androide aliado","Acesso a uma rede restrita"]
  }
};
const GENRE_NAME = {fantasia:"Fantasia", horror:"Horror", scifi:"Ficção científica"};
/* Foco do evento aleatório: [máximo no d100, nome, explicação, lista envolvida] */
const FOCO = [
  [7,"Evento remoto","Algo acontece longe daqui, mas a notícia ou as consequências chegam até você."],
  [14,"O ambiente muda","O lugar, o clima ou as circunstâncias ao redor se transformam."],
  [26,"Um personagem age","Alguém já conhecido toma uma iniciativa própria.","npc"],
  [33,"Novo personagem","Alguém novo entra em cena."],
  [44,"Um fio avança","Algo aproxima você de resolver um dos fios.","fio"],
  [52,"Um fio se complica","Um dos fios fica mais difícil ou mais perigoso.","fio"],
  [56,"Um fio se encerra","Um dos fios termina, bem ou mal, por motivos alheios a você.","fio"],
  [62,"Surge um novo fio","Uma nova meta, dívida ou mistério aparece."],
  [70,"Revelação","Um segredo vem à tona."],
  [78,"Uma ameaça surge","Perigo novo e imediato."],
  [84,"Oportunidade","Algo a seu favor: um recurso, uma brecha, uma ajuda."],
  [90,"Problema para você","Algo dá errado para o seu personagem."],
  [95,"O passado retorna","Alguém ou algo de antes reaparece.","npc"],
  [100,"Livre interpretação","Use apenas Ação + Tema e deixe a história surpreender você."]
];
const REACAO = [[2,"Hostil","Ataca, ameaça ou expulsa."],[5,"Desfavorável","Desconfia e atrapalha."],[8,"Neutro","Cauteloso; quer saber o que ganha com isso."],[11,"Favorável","Disposto a ajudar dentro do razoável."],[12,"Amigável","Ajuda de bom grado e confia em você."]];
const LIK = [
  {n:"Impossível",p:5},{n:"Quase impossível",p:10},{n:"Muito improvável",p:20},{n:"Improvável",p:35},{n:"50/50",p:50},
  {n:"Provável",p:65},{n:"Muito provável",p:80},{n:"Quase certo",p:90},{n:"Certo",p:95}
];
const TABLE_INFO = [
  ["acao","Ação"],["tema","Tema"],["adjetivo","Descritor: adjetivo"],["modo","Descritor: modo"],["local","Local"],["objeto","Objeto"],
  ["profissao","Personagem: papel"],["traco","Personagem: traço"],["motivacao","Motivação"],["clima","Clima"],["tesouro","Tesouro"],
  ["alteracao","Cena alterada"],["obstaculo","Obstáculo"],["gancho","Aventura: gancho"],["patrono","Aventura: contratante"],["objetivo","Aventura: objetivo"],
  ["complicacao","Aventura: complicação"],["reviravolta","Aventura: reviravolta"],["pressao","Aventura: prazo"],
  ["tamanho","Monstro: tamanho"],["forma","Monstro: forma"],["tracoMonstro","Monstro: traço"],["locomocao","Monstro: locomoção"],["ataque","Monstro: ataque"],
  ["habilidade","Monstro: habilidade"],["fraqueza","Monstro: fraqueza"],["comportamento","Monstro: comportamento"],["habitat","Monstro: habitat"],
  ["desejo","Monstro: desejo"],["sinal","Monstro: sinal de presença"],["despojo","Monstro: despojo"],["origem","Monstro: origem"]
];

/* ---------- Nomes (sempre sorteados pelo site) ---------- */
const NS = {
  a:["Al","Bel","Cor","Dar","El","Fen","Gal","Hal","Ir","Jor","Kel","Lor","Mar","Nor","Or","Per","Ros","Sar","Tal","Ul","Val","Zan","Ber","Cas","Mir","Tor","Lis","An","Iv","Ed"],
  b:["a","e","i","o","an","en","ar","or","il","ad","",""],
  c:["ric","dor","ion","ana","elle","as","us","ina","on","ia","eth","win","ara","ius","os","yn","a","ed"]
};
const MS = {
  a:["Gor","Vak","Skr","Thul","Mor","Zhar","Grak","Nyx","Ur","Krul","Vor","Sith","Drak","Bael","Xul","Gh"],
  b:["a","o","u","ag","ix","ul","eth","ar","",""],
  c:["oth","gul","ax","ith","rak","mor","yx","ath","ung","ok","esh","ul"]
};

/* Ficha genérica de monstro, por nível (1 a 10) e tamanho. */
const THREAT = ["Baixa","Baixa","Moderada","Moderada","Alta","Alta","Perigosa","Perigosa","Mortal","Mortal"];
const DMG = ["1d6","1d6","1d8","1d8","2d6","2d6","2d8","2d8","3d8","3d8"];
const SIZE_MULT = [0.5, 0.75, 1, 1.25, 1.6, 2];
