import React, { useState, useEffect } from 'react';
import { Settings, Trophy, X, XCircle, Globe, Map, RotateCcw } from 'lucide-react';

const FlagQuizApp = () => {
  const [language, setLanguage] = useState('en');
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState(2);
  const [timer, setTimer] = useState(null);
  const [quizMode, setQuizMode] = useState(null);
  const [usedFlags, setUsedFlags] = useState([]);
  const [showComplete, setShowComplete] = useState(false);

  const translations = {
    en: {
      title: "Flag Quiz Game",
      selectMode: "Select Quiz Mode",
      countriesMode: "World Countries",
      brazilMode: "Brazilian States",
      score: "Correct",
      wrongScore: "Wrong",
      settings: "Settings",
      autoAdvance: "Auto advance to next question",
      manualAdvance: "Show next button",
      secondsDelay: "Seconds delay after answer",
      close: "Close",
      next: "Next",
      backToMenu: "Back to Menu",
      whichCountry: "Which country does this flag belong to?",
      whichState: "Which Brazilian state does this flag belong to?",
      quizComplete: "Quiz Complete!",
      finalScore: "Final Score",
      restart: "Restart Quiz"
    },
    pt: {
      title: "Quiz de Bandeiras",
      selectMode: "Selecione o Modo do Quiz",
      countriesMode: "Países do Mundo",
      brazilMode: "Estados Brasileiros",
      score: "Certas",
      wrongScore: "Erradas",
      settings: "Configurações",
      autoAdvance: "Avançar automaticamente para próxima pergunta",
      manualAdvance: "Mostrar botão próximo",
      secondsDelay: "Segundos de atraso após resposta",
      close: "Fechar",
      next: "Próximo",
      backToMenu: "Voltar ao Menu",
      whichCountry: "A qual país pertence esta bandeira?",
      whichState: "A qual estado brasileiro pertence esta bandeira?",
      quizComplete: "Quiz Completo!",
      finalScore: "Pontuação Final",
      restart: "Reiniciar Quiz"
    }
  };

  const countries = [
    { code: 'AF', en: 'Afghanistan', pt: 'Afeganistão' },
    { code: 'AL', en: 'Albania', pt: 'Albânia' },
    { code: 'DZ', en: 'Algeria', pt: 'Argélia' },
    { code: 'AD', en: 'Andorra', pt: 'Andorra' },
    { code: 'AO', en: 'Angola', pt: 'Angola' },
    { code: 'AG', en: 'Antigua and Barbuda', pt: 'Antígua e Barbuda' },
    { code: 'AR', en: 'Argentina', pt: 'Argentina' },
    { code: 'AM', en: 'Armenia', pt: 'Armênia' },
    { code: 'AU', en: 'Australia', pt: 'Austrália' },
    { code: 'AT', en: 'Austria', pt: 'Áustria' },
    { code: 'AZ', en: 'Azerbaijan', pt: 'Azerbaijão' },
    { code: 'BS', en: 'Bahamas', pt: 'Bahamas' },
    { code: 'BH', en: 'Bahrain', pt: 'Bahrein' },
    { code: 'BD', en: 'Bangladesh', pt: 'Bangladesh' },
    { code: 'BB', en: 'Barbados', pt: 'Barbados' },
    { code: 'BY', en: 'Belarus', pt: 'Belarus' },
    { code: 'BE', en: 'Belgium', pt: 'Bélgica' },
    { code: 'BZ', en: 'Belize', pt: 'Belize' },
    { code: 'BJ', en: 'Benin', pt: 'Benin' },
    { code: 'BT', en: 'Bhutan', pt: 'Butão' },
    { code: 'BO', en: 'Bolivia', pt: 'Bolívia' },
    { code: 'BA', en: 'Bosnia and Herzegovina', pt: 'Bósnia e Herzegovina' },
    { code: 'BW', en: 'Botswana', pt: 'Botsuana' },
    { code: 'BR', en: 'Brazil', pt: 'Brasil' },
    { code: 'BN', en: 'Brunei', pt: 'Brunei' },
    { code: 'BG', en: 'Bulgaria', pt: 'Bulgária' },
    { code: 'BF', en: 'Burkina Faso', pt: 'Burkina Faso' },
    { code: 'BI', en: 'Burundi', pt: 'Burundi' },
    { code: 'CV', en: 'Cabo Verde', pt: 'Cabo Verde' },
    { code: 'KH', en: 'Cambodia', pt: 'Camboja' },
    { code: 'CM', en: 'Cameroon', pt: 'Camarões' },
    { code: 'CA', en: 'Canada', pt: 'Canadá' },
    { code: 'CF', en: 'Central African Republic', pt: 'República Centro-Africana' },
    { code: 'TD', en: 'Chad', pt: 'Chade' },
    { code: 'CL', en: 'Chile', pt: 'Chile' },
    { code: 'CN', en: 'China', pt: 'China' },
    { code: 'CO', en: 'Colombia', pt: 'Colômbia' },
    { code: 'KM', en: 'Comoros', pt: 'Comores' },
    { code: 'CG', en: 'Congo', pt: 'Congo' },
    { code: 'CD', en: 'Democratic Republic of the Congo', pt: 'República Democrática do Congo' },
    { code: 'CR', en: 'Costa Rica', pt: 'Costa Rica' },
    { code: 'HR', en: 'Croatia', pt: 'Croácia' },
    { code: 'CU', en: 'Cuba', pt: 'Cuba' },
    { code: 'CY', en: 'Cyprus', pt: 'Chipre' },
    { code: 'CZ', en: 'Czech Republic', pt: 'República Tcheca' },
    { code: 'CI', en: 'Côte d\'Ivoire', pt: 'Costa do Marfim' },
    { code: 'DK', en: 'Denmark', pt: 'Dinamarca' },
    { code: 'DJ', en: 'Djibouti', pt: 'Djibuti' },
    { code: 'DM', en: 'Dominica', pt: 'Dominica' },
    { code: 'DO', en: 'Dominican Republic', pt: 'República Dominicana' },
    { code: 'EC', en: 'Ecuador', pt: 'Equador' },
    { code: 'EG', en: 'Egypt', pt: 'Egito' },
    { code: 'SV', en: 'El Salvador', pt: 'El Salvador' },
    { code: 'GQ', en: 'Equatorial Guinea', pt: 'Guiné Equatorial' },
    { code: 'ER', en: 'Eritrea', pt: 'Eritreia' },
    { code: 'EE', en: 'Estonia', pt: 'Estônia' },
    { code: 'SZ', en: 'Eswatini', pt: 'Eswatini' },
    { code: 'ET', en: 'Ethiopia', pt: 'Etiópia' },
    { code: 'FJ', en: 'Fiji', pt: 'Fiji' },
    { code: 'FI', en: 'Finland', pt: 'Finlândia' },
    { code: 'FR', en: 'France', pt: 'França' },
    { code: 'GA', en: 'Gabon', pt: 'Gabão' },
    { code: 'GM', en: 'Gambia', pt: 'Gâmbia' },
    { code: 'GE', en: 'Georgia', pt: 'Geórgia' },
    { code: 'DE', en: 'Germany', pt: 'Alemanha' },
    { code: 'GH', en: 'Ghana', pt: 'Gana' },
    { code: 'GR', en: 'Greece', pt: 'Grécia' },
    { code: 'GD', en: 'Grenada', pt: 'Granada' },
    { code: 'GT', en: 'Guatemala', pt: 'Guatemala' },
    { code: 'GN', en: 'Guinea', pt: 'Guiné' },
    { code: 'GW', en: 'Guinea-Bissau', pt: 'Guiné-Bissau' },
    { code: 'GY', en: 'Guyana', pt: 'Guiana' },
    { code: 'HT', en: 'Haiti', pt: 'Haiti' },
    { code: 'HN', en: 'Honduras', pt: 'Honduras' },
    { code: 'HU', en: 'Hungary', pt: 'Hungria' },
    { code: 'IS', en: 'Iceland', pt: 'Islândia' },
    { code: 'IN', en: 'India', pt: 'Índia' },
    { code: 'ID', en: 'Indonesia', pt: 'Indonésia' },
    { code: 'IR', en: 'Iran', pt: 'Irã' },
    { code: 'IQ', en: 'Iraq', pt: 'Iraque' },
    { code: 'IE', en: 'Ireland', pt: 'Irlanda' },
    { code: 'IL', en: 'Israel', pt: 'Israel' },
    { code: 'IT', en: 'Italy', pt: 'Itália' },
    { code: 'JM', en: 'Jamaica', pt: 'Jamaica' },
    { code: 'JP', en: 'Japan', pt: 'Japão' },
    { code: 'JO', en: 'Jordan', pt: 'Jordânia' },
    { code: 'KZ', en: 'Kazakhstan', pt: 'Cazaquistão' },
    { code: 'KE', en: 'Kenya', pt: 'Quênia' },
    { code: 'KI', en: 'Kiribati', pt: 'Kiribati' },
    { code: 'KP', en: 'North Korea', pt: 'Coreia do Norte' },
    { code: 'KR', en: 'South Korea', pt: 'Coreia do Sul' },
    { code: 'KW', en: 'Kuwait', pt: 'Kuwait' },
    { code: 'KG', en: 'Kyrgyzstan', pt: 'Quirguistão' },
    { code: 'LA', en: 'Laos', pt: 'Laos' },
    { code: 'LV', en: 'Latvia', pt: 'Letônia' },
    { code: 'LB', en: 'Lebanon', pt: 'Líbano' },
    { code: 'LS', en: 'Lesotho', pt: 'Lesoto' },
    { code: 'LR', en: 'Liberia', pt: 'Libéria' },
    { code: 'LY', en: 'Libya', pt: 'Líbia' },
    { code: 'LI', en: 'Liechtenstein', pt: 'Liechtenstein' },
    { code: 'LT', en: 'Lithuania', pt: 'Lituânia' },
    { code: 'LU', en: 'Luxembourg', pt: 'Luxemburgo' },
    { code: 'MG', en: 'Madagascar', pt: 'Madagáscar' },
    { code: 'MW', en: 'Malawi', pt: 'Malawi' },
    { code: 'MY', en: 'Malaysia', pt: 'Malásia' },
    { code: 'MV', en: 'Maldives', pt: 'Maldivas' },
    { code: 'ML', en: 'Mali', pt: 'Mali' },
    { code: 'MT', en: 'Malta', pt: 'Malta' },
    { code: 'MH', en: 'Marshall Islands', pt: 'Ilhas Marshall' },
    { code: 'MR', en: 'Mauritania', pt: 'Mauritânia' },
    { code: 'MU', en: 'Mauritius', pt: 'Maurícia' },
    { code: 'MX', en: 'Mexico', pt: 'México' },
    { code: 'FM', en: 'Micronesia', pt: 'Micronésia' },
    { code: 'MD', en: 'Moldova', pt: 'Moldávia' },
    { code: 'MC', en: 'Monaco', pt: 'Mônaco' },
    { code: 'MN', en: 'Mongolia', pt: 'Mongólia' },
    { code: 'ME', en: 'Montenegro', pt: 'Montenegro' },
    { code: 'MA', en: 'Morocco', pt: 'Marrocos' },
    { code: 'MZ', en: 'Mozambique', pt: 'Moçambique' },
    { code: 'MM', en: 'Myanmar', pt: 'Mianmar' },
    { code: 'NA', en: 'Namibia', pt: 'Namíbia' },
    { code: 'NR', en: 'Nauru', pt: 'Nauru' },
    { code: 'NP', en: 'Nepal', pt: 'Nepal' },
    { code: 'NL', en: 'Netherlands', pt: 'Países Baixos' },
    { code: 'NZ', en: 'New Zealand', pt: 'Nova Zelândia' },
    { code: 'NI', en: 'Nicaragua', pt: 'Nicarágua' },
    { code: 'NE', en: 'Niger', pt: 'Níger' },
    { code: 'NG', en: 'Nigeria', pt: 'Nigéria' },
    { code: 'MK', en: 'North Macedonia', pt: 'Macedônia do Norte' },
    { code: 'NO', en: 'Norway', pt: 'Noruega' },
    { code: 'OM', en: 'Oman', pt: 'Omã' },
    { code: 'PK', en: 'Pakistan', pt: 'Paquistão' },
    { code: 'PW', en: 'Palau', pt: 'Palau' },
    { code: 'PS', en: 'Palestine', pt: 'Palestina' },
    { code: 'PA', en: 'Panama', pt: 'Panamá' },
    { code: 'PG', en: 'Papua New Guinea', pt: 'Papua-Nova Guiné' },
    { code: 'PY', en: 'Paraguay', pt: 'Paraguai' },
    { code: 'PE', en: 'Peru', pt: 'Peru' },
    { code: 'PH', en: 'Philippines', pt: 'Filipinas' },
    { code: 'PL', en: 'Poland', pt: 'Polônia' },
    { code: 'PT', en: 'Portugal', pt: 'Portugal' },
    { code: 'QA', en: 'Qatar', pt: 'Catar' },
    { code: 'RO', en: 'Romania', pt: 'Romênia' },
    { code: 'RU', en: 'Russia', pt: 'Rússia' },
    { code: 'RW', en: 'Rwanda', pt: 'Ruanda' },
    { code: 'KN', en: 'Saint Kitts and Nevis', pt: 'São Cristóvão e Nevis' },
    { code: 'LC', en: 'Saint Lucia', pt: 'Santa Lúcia' },
    { code: 'VC', en: 'Saint Vincent and the Grenadines', pt: 'São Vicente e Granadinas' },
    { code: 'WS', en: 'Samoa', pt: 'Samoa' },
    { code: 'SM', en: 'San Marino', pt: 'San Marino' },
    { code: 'ST', en: 'São Tomé and Príncipe', pt: 'São Tomé e Príncipe' },
    { code: 'SA', en: 'Saudi Arabia', pt: 'Arábia Saudita' },
    { code: 'SN', en: 'Senegal', pt: 'Senegal' },
    { code: 'RS', en: 'Serbia', pt: 'Sérvia' },
    { code: 'SC', en: 'Seychelles', pt: 'Seicheles' },
    { code: 'SL', en: 'Sierra Leone', pt: 'Serra Leoa' },
    { code: 'SG', en: 'Singapore', pt: 'Singapura' },
    { code: 'SK', en: 'Slovakia', pt: 'Eslováquia' },
    { code: 'SI', en: 'Slovenia', pt: 'Eslovênia' },
    { code: 'SB', en: 'Solomon Islands', pt: 'Ilhas Salomão' },
    { code: 'SO', en: 'Somalia', pt: 'Somália' },
    { code: 'ZA', en: 'South Africa', pt: 'África do Sul' },
    { code: 'SS', en: 'South Sudan', pt: 'Sudão do Sul' },
    { code: 'ES', en: 'Spain', pt: 'Espanha' },
    { code: 'LK', en: 'Sri Lanka', pt: 'Sri Lanka' },
    { code: 'SD', en: 'Sudan', pt: 'Sudão' },
    { code: 'SR', en: 'Suriname', pt: 'Suriname' },
    { code: 'SE', en: 'Sweden', pt: 'Suécia' },
    { code: 'CH', en: 'Switzerland', pt: 'Suíça' },
    { code: 'SY', en: 'Syria', pt: 'Síria' },
    { code: 'TJ', en: 'Tajikistan', pt: 'Tajiquistão' },
    { code: 'TZ', en: 'Tanzania', pt: 'Tanzânia' },
    { code: 'TH', en: 'Thailand', pt: 'Tailândia' },
    { code: 'TL', en: 'Timor-Leste', pt: 'Timor-Leste' },
    { code: 'TG', en: 'Togo', pt: 'Togo' },
    { code: 'TO', en: 'Tonga', pt: 'Tonga' },
    { code: 'TT', en: 'Trinidad and Tobago', pt: 'Trinidad e Tobago' },
    { code: 'TN', en: 'Tunisia', pt: 'Tunísia' },
    { code: 'TR', en: 'Turkey', pt: 'Turquia' },
    { code: 'TM', en: 'Turkmenistan', pt: 'Turcomenistão' },
    { code: 'TV', en: 'Tuvalu', pt: 'Tuvalu' },
    { code: 'UG', en: 'Uganda', pt: 'Uganda' },
    { code: 'UA', en: 'Ukraine', pt: 'Ucrânia' },
    { code: 'AE', en: 'United Arab Emirates', pt: 'Emirados Árabes Unidos' },
    { code: 'GB', en: 'United Kingdom', pt: 'Reino Unido' },
    { code: 'US', en: 'United States', pt: 'Estados Unidos' },
    { code: 'UY', en: 'Uruguay', pt: 'Uruguai' },
    { code: 'UZ', en: 'Uzbekistan', pt: 'Uzbequistão' },
    { code: 'VU', en: 'Vanuatu', pt: 'Vanuatu' },
    { code: 'VA', en: 'Vatican City', pt: 'Cidade do Vaticano' },
    { code: 'VE', en: 'Venezuela', pt: 'Venezuela' },
    { code: 'VN', en: 'Vietnam', pt: 'Vietnã' },
    { code: 'YE', en: 'Yemen', pt: 'Iêmen' },
    { code: 'ZM', en: 'Zambia', pt: 'Zâmbia' },
    { code: 'ZW', en: 'Zimbabwe', pt: 'Zimbábue' },
    { code: 'TW', en: 'Taiwan', pt: 'Taiwan' },
    { code: 'XK', en: 'Kosovo', pt: 'Kosovo' },
    { code: 'EH', en: 'Western Sahara', pt: 'Saara Ocidental' },
  ];

  const brazilianStates = [
    { code: 'AC', en: 'Acre', pt: 'Acre', flag: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bandeira_do_Acre.svg' },
    { code: 'AL', en: 'Alagoas', pt: 'Alagoas', flag: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Bandeira_de_Alagoas.svg' },
    { code: 'AP', en: 'Amapá', pt: 'Amapá', flag: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Bandeira_do_Amapá.svg' },
    { code: 'AM', en: 'Amazonas', pt: 'Amazonas', flag: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bandeira_do_Amazonas.svg' },
    { code: 'BA', en: 'Bahia', pt: 'Bahia', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Bandeira_da_Bahia.svg' },
    { code: 'CE', en: 'Ceará', pt: 'Ceará', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Bandeira_do_Ceará.svg' },
    { code: 'DF', en: 'Federal District', pt: 'Distrito Federal', flag: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bandeira_do_Distrito_Federal_%28Brasil%29.svg' },
    { code: 'ES', en: 'Espírito Santo', pt: 'Espírito Santo', flag: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Bandeira_do_Espírito_Santo.svg' },
    { code: 'GO', en: 'Goiás', pt: 'Goiás', flag: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_Goiás.svg' },
    { code: 'MA', en: 'Maranhão', pt: 'Maranhão', flag: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Bandeira_do_Maranhão.svg' },
    { code: 'MT', en: 'Mato Grosso', pt: 'Mato Grosso', flag: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bandeira_de_Mato_Grosso.svg' },
    { code: 'MS', en: 'Mato Grosso do Sul', pt: 'Mato Grosso do Sul', flag: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Bandeira_de_Mato_Grosso_do_Sul.svg' },
    { code: 'MG', en: 'Minas Gerais', pt: 'Minas Gerais', flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Bandeira_de_Minas_Gerais.svg' },
    { code: 'PA', en: 'Pará', pt: 'Pará', flag: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Bandeira_do_Pará.svg' },
    { code: 'PB', en: 'Paraíba', pt: 'Paraíba', flag: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Paraíba.svg' },
    { code: 'PR', en: 'Paraná', pt: 'Paraná', flag: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Bandeira_do_Paraná.svg' },
    { code: 'PE', en: 'Pernambuco', pt: 'Pernambuco', flag: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Bandeira_de_Pernambuco.svg' },
    { code: 'PI', en: 'Piauí', pt: 'Piauí', flag: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Bandeira_do_Piauí.svg' },
    { code: 'RJ', en: 'Rio de Janeiro', pt: 'Rio de Janeiro', flag: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg' },
    { code: 'RN', en: 'Rio Grande do Norte', pt: 'Rio Grande do Norte', flag: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bandeira_do_Rio_Grande_do_Norte.svg' },
    { code: 'RS', en: 'Rio Grande do Sul', pt: 'Rio Grande do Sul', flag: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Bandeira_do_Rio_Grande_do_Sul.svg' },
    { code: 'RO', en: 'Rondônia', pt: 'Rondônia', flag: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Bandeira_de_Rondônia.svg' },
    { code: 'RR', en: 'Roraima', pt: 'Roraima', flag: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Bandeira_de_Roraima.svg' },
    { code: 'SC', en: 'Santa Catarina', pt: 'Santa Catarina', flag: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Bandeira_de_Santa_Catarina.svg' },
    { code: 'SP', en: 'São Paulo', pt: 'São Paulo', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Bandeira_do_estado_de_São_Paulo.svg' },
    { code: 'SE', en: 'Sergipe', pt: 'Sergipe', flag: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Sergipe.svg' },
    { code: 'TO', en: 'Tocantins', pt: 'Tocantins', flag: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Bandeira_do_Tocantins.svg' }
  ];

  useEffect(() => {
    const portugueseSpeaking = new Set(['BR', 'PT', 'AO', 'MZ', 'GW', 'TL', 'GQ', 'CV', 'ST']);
    const userLang = navigator.language.split('-')[0];
    const userCountry = navigator.language.split('-')[1];

    // Try to load saved state
    try {
      const savedState = JSON.parse(localStorage.getItem('flagQuizState') || '{}');
      if (savedState.language) setLanguage(savedState.language);
      else if (userLang === 'pt' || portugueseSpeaking.has(userCountry)) {
        setLanguage('pt');
      }

      if (savedState.autoAdvance !== undefined) setAutoAdvance(savedState.autoAdvance);
      if (savedState.autoAdvanceSeconds) setAutoAdvanceSeconds(savedState.autoAdvanceSeconds);
      if (savedState.quizMode) setQuizMode(savedState.quizMode);
      if (savedState.score !== undefined) setScore(savedState.score);
      if (savedState.wrongAnswers !== undefined) setWrongAnswers(savedState.wrongAnswers);
      if (savedState.usedFlags) setUsedFlags(savedState.usedFlags);
      if (savedState.showComplete !== undefined) setShowComplete(savedState.showComplete);
    } catch (e) {
      // If loading fails, just use defaults
      if (userLang === 'pt' || portugueseSpeaking.has(userCountry)) {
        setLanguage('pt');
      } else {
        throw e;
      }
    }
  }, []);

  useEffect(() => {
    if (quizMode && !currentQuestion && !showComplete) {
      generateQuestion();
    }
  }, [quizMode]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      language,
      autoAdvance,
      autoAdvanceSeconds,
      quizMode,
      score,
      wrongAnswers,
      usedFlags,
      showComplete
    };
    localStorage.setItem('flagQuizState', JSON.stringify(stateToSave));
  }, [language, autoAdvance, autoAdvanceSeconds, quizMode, score, wrongAnswers, usedFlags, showComplete]);

  useEffect(() => {
    if (selectedAnswer !== null && autoAdvance) {
      const timeoutId = setTimeout(() => {
        generateQuestion();
      }, autoAdvanceSeconds * 1000);
      setTimer(timeoutId);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedAnswer, autoAdvance, autoAdvanceSeconds]);

  const generateQuestion = () => {
    setSelectedAnswer(null);
    if (timer) clearTimeout(timer);

    const dataSet = quizMode === 'countries' ? countries : brazilianStates;

    // Check if all flags have been used
    if (usedFlags.length >= dataSet.length) {
      setShowComplete(true);
      return;
    }

    // Get available flags (not yet used)
    const availableFlags = dataSet.filter(item => !usedFlags.includes(item.code));

    const correctItem = availableFlags[Math.floor(Math.random() * availableFlags.length)];
    const wrongItems = [];

    while (wrongItems.length < 3) {
      const random = dataSet[Math.floor(Math.random() * dataSet.length)];
      if (random.code !== correctItem.code && !wrongItems.includes(random)) {
        wrongItems.push(random);
      }
    }

    const options = [...wrongItems, correctItem].sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      correct: correctItem,
      options: options
    });

    // Mark this flag as used
    setUsedFlags([...usedFlags, correctItem.code]);
  };

  const handleAnswer = (item) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(item);
    if (item.code === currentQuestion.correct.code) {
      setScore(score + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }
  };

  const handleBackToMenu = () => {
    setQuizMode(null);
    setScore(0);
    setWrongAnswers(0);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setUsedFlags([]);
    setShowComplete(false);
  };

  const handleRestart = () => {
    setScore(0);
    setWrongAnswers(0);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setUsedFlags([]);
    setShowComplete(false);
    setTimeout(() => generateQuestion(), 100);
  };

  const t = translations[language];

  if (!quizMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-indigo-600 text-center mb-8">{t.title}</h1>
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-8">{t.selectMode}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setQuizMode('countries')}
                className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Globe className="w-16 h-16 mx-auto mb-4" />
                <span className="text-2xl font-bold">{t.countriesMode}</span>
              </button>

              <button
                onClick={() => setQuizMode('brazil')}
                className="p-8 bg-gradient-to-br from-green-500 to-yellow-500 text-white rounded-xl hover:from-green-600 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Map className="w-16 h-16 mx-auto mb-4" />
                <span className="text-2xl font-bold">{t.brazilMode}</span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {language === 'en' ? 'Português' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1"></div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex gap-4 mb-6 items-center">
            <div className="flex items-center justify-center gap-2 bg-green-50 p-3 rounded-lg flex-1">
              <Trophy className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-green-700">
                {score}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-red-50 p-3 rounded-lg flex-1">
              <XCircle className="w-6 h-6 text-red-600" />
              <span className="text-2xl font-bold text-red-700">
                {wrongAnswers}
              </span>
            </div>
            <button
              onClick={handleRestart}
              className="p-3 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
              title={t.restart}
            >
              <RotateCcw className="w-6 h-6 text-indigo-600" />
            </button>
          </div>

          {showSettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">{t.settings}</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoAdvance"
                    checked={autoAdvance}
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="autoAdvance" className="text-sm">
                    {t.autoAdvance}
                  </label>
                </div>

                {autoAdvance && (
                  <div className="ml-7">
                    <label className="block text-sm mb-2">{t.secondsDelay}</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={autoAdvanceSeconds}
                      onChange={(e) => setAutoAdvanceSeconds(Number.parseInt(e.target.value) || 3)}
                      className="w-20 px-3 py-2 border rounded-lg"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    {language === 'en' ? 'Português' : 'English'}
                  </button>
                </div>

                <div className="pt-2 border-t">
                  <button
                    onClick={handleBackToMenu}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {t.backToMenu}
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentQuestion && !showComplete && (
            <div>
              <p className="text-center text-lg mb-4 text-gray-700">
                {quizMode === 'countries' ? t.whichCountry : t.whichState}
              </p>

              <div className="flex justify-center mb-6">
                <div className="w-80 h-56 flex items-center justify-center bg-gray-50 rounded-lg shadow-lg border-4 border-gray-200">
                  <img
                    src={quizMode === 'countries'
                      ? `https://flagcdn.com/w320/${currentQuestion.correct.code.toLowerCase()}.png`
                      : currentQuestion.correct.flag}
                    alt="Flag"
                    className="max-w-full max-h-full object-contain p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                {currentQuestion.options.map((item) => {
                  const isSelected = selectedAnswer?.code === item.code;
                  const isCorrect = item.code === currentQuestion.correct.code;
                  const showResult = selectedAnswer !== null;

                  let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all font-medium ";

                  if (!showResult) {
                    buttonClass += "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50";
                  } else if (isCorrect) {
                    buttonClass += "border-green-500 bg-green-100 text-green-800";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "border-red-500 bg-red-100 text-red-800";
                  } else {
                    buttonClass += "border-gray-300 opacity-50";
                  }

                  return (
                    <button
                      key={item.code}
                      onClick={() => handleAnswer(item)}
                      disabled={selectedAnswer !== null}
                      className={buttonClass}
                    >
                      {item[language]}
                    </button>
                  );
                })}
              </div>

              {!autoAdvance && selectedAnswer !== null && (
                <button
                  onClick={generateQuestion}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  {t.next}
                </button>
              )}
            </div>
          )}

          {showComplete && (
            <div className="text-center py-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-indigo-600 mb-4">{t.quizComplete}</h2>
                <p className="text-xl text-gray-700 mb-6">{t.finalScore}</p>
              </div>

              <div className="flex gap-4 justify-center mb-8">
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 flex-1 max-w-xs">
                  <Trophy className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-green-700">{score}</p>
                  <p className="text-sm text-green-600">{t.score}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200 flex-1 max-w-xs">
                  <XCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-red-700">{wrongAnswers}</p>
                  <p className="text-sm text-red-600">{t.wrongScore}</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  {t.restart}
                </button>
                <button
                  onClick={handleBackToMenu}
                  className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  {t.backToMenu}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlagQuizApp