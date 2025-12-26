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

  // New states for checkbox selection
  const [showQuestionTypeSelection, setShowQuestionTypeSelection] = useState(false);
  const [questionTypes, setQuestionTypes] = useState({
    name: true,
    continentOrRegion: false,
    capital: false
  });
  const [multiQuestionMode, setMultiQuestionMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionSet, setCurrentQuestionSet] = useState([]);
  const [questionSetAnswers, setQuestionSetAnswers] = useState([]);

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
      restart: "Restart Quiz",
      selectQuestionTypes: "Select Question Types",
      name: "Name",
      continent: "Continent",
      region: "Region",
      capital: "Capital",
      startQuiz: "Start Quiz",
      whatIsTheContinent: "What continent is this country in?",
      whatIsTheRegion: "What region is this state in?",
      whatIsTheCapital: "What is the capital?",
      questionProgress: "Question {current} of {total}"
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
      restart: "Reiniciar Quiz",
      selectQuestionTypes: "Selecione os Tipos de Pergunta",
      name: "Nome",
      continent: "Continente",
      region: "Região",
      capital: "Capital",
      startQuiz: "Iniciar Quiz",
      whatIsTheContinent: "Em que continente fica este país?",
      whatIsTheRegion: "Em que região fica este estado?",
      whatIsTheCapital: "Qual é a capital?",
      questionProgress: "Pergunta {current} de {total}"
    }
  };

  // Extended country data with continents and capitals
  const countries = [
    { code: 'AF', en: 'Afghanistan', pt: 'Afeganistão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Kabul', pt: 'Cabul' } },
    { code: 'AL', en: 'Albania', pt: 'Albânia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Tirana', pt: 'Tirana' } },
    { code: 'DZ', en: 'Algeria', pt: 'Argélia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Algiers', pt: 'Argel' } },
    { code: 'AD', en: 'Andorra', pt: 'Andorra', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Andorra la Vella', pt: 'Andorra-a-Velha' } },
    { code: 'AO', en: 'Angola', pt: 'Angola', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Luanda', pt: 'Luanda' } },
    { code: 'AG', en: 'Antigua and Barbuda', pt: 'Antígua e Barbuda', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Saint John\'s', pt: 'Saint John\'s' } },
    { code: 'AR', en: 'Argentina', pt: 'Argentina', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Buenos Aires', pt: 'Buenos Aires' } },
    { code: 'AM', en: 'Armenia', pt: 'Armênia', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Yerevan', pt: 'Ierevan' } },
    { code: 'AU', en: 'Australia', pt: 'Austrália', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Canberra', pt: 'Camberra' } },
    { code: 'AT', en: 'Austria', pt: 'Áustria', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Vienna', pt: 'Viena' } },
    { code: 'AZ', en: 'Azerbaijan', pt: 'Azerbaijão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Baku', pt: 'Baku' } },
    { code: 'BS', en: 'Bahamas', pt: 'Bahamas', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Nassau', pt: 'Nassau' } },
    { code: 'BH', en: 'Bahrain', pt: 'Bahrein', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Manama', pt: 'Manama' } },
    { code: 'BD', en: 'Bangladesh', pt: 'Bangladesh', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Dhaka', pt: 'Daca' } },
    { code: 'BB', en: 'Barbados', pt: 'Barbados', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Bridgetown', pt: 'Bridgetown' } },
    { code: 'BY', en: 'Belarus', pt: 'Belarus', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Minsk', pt: 'Minsk' } },
    { code: 'BE', en: 'Belgium', pt: 'Bélgica', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Brussels', pt: 'Bruxelas' } },
    { code: 'BZ', en: 'Belize', pt: 'Belize', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Belmopan', pt: 'Belmopan' } },
    { code: 'BJ', en: 'Benin', pt: 'Benin', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Porto-Novo', pt: 'Porto-Novo' } },
    { code: 'BT', en: 'Bhutan', pt: 'Butão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Thimphu', pt: 'Timphu' } },
    { code: 'BO', en: 'Bolivia', pt: 'Bolívia', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Sucre', pt: 'Sucre' } },
    { code: 'BA', en: 'Bosnia and Herzegovina', pt: 'Bósnia e Herzegovina', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Sarajevo', pt: 'Sarajevo' } },
    { code: 'BW', en: 'Botswana', pt: 'Botsuana', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Gaborone', pt: 'Gaborone' } },
    { code: 'BR', en: 'Brazil', pt: 'Brasil', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Brasília', pt: 'Brasília' } },
    { code: 'BN', en: 'Brunei', pt: 'Brunei', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Bandar Seri Begawan', pt: 'Bandar Seri Begawan' } },
    { code: 'BG', en: 'Bulgaria', pt: 'Bulgária', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Sofia', pt: 'Sófia' } },
    { code: 'BF', en: 'Burkina Faso', pt: 'Burkina Faso', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Ouagadougou', pt: 'Uagadugu' } },
    { code: 'BI', en: 'Burundi', pt: 'Burundi', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Gitega', pt: 'Gitega' } },
    { code: 'CV', en: 'Cabo Verde', pt: 'Cabo Verde', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Praia', pt: 'Praia' } },
    { code: 'KH', en: 'Cambodia', pt: 'Camboja', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Phnom Penh', pt: 'Phnom Penh' } },
    { code: 'CM', en: 'Cameroon', pt: 'Camarões', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Yaoundé', pt: 'Iaundé' } },
    { code: 'CA', en: 'Canada', pt: 'Canadá', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Ottawa', pt: 'Ottawa' } },
    { code: 'CF', en: 'Central African Republic', pt: 'República Centro-Africana', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Bangui', pt: 'Bangui' } },
    { code: 'TD', en: 'Chad', pt: 'Chade', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'N\'Djamena', pt: 'N\'Djamena' } },
    { code: 'CL', en: 'Chile', pt: 'Chile', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Santiago', pt: 'Santiago' } },
    { code: 'CN', en: 'China', pt: 'China', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Beijing', pt: 'Pequim' } },
    { code: 'CO', en: 'Colombia', pt: 'Colômbia', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Bogotá', pt: 'Bogotá' } },
    { code: 'KM', en: 'Comoros', pt: 'Comores', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Moroni', pt: 'Moroni' } },
    { code: 'CG', en: 'Congo', pt: 'Congo', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Brazzaville', pt: 'Brazzaville' } },
    { code: 'CD', en: 'Democratic Republic of the Congo', pt: 'República Democrática do Congo', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Kinshasa', pt: 'Kinshasa' } },
    { code: 'CR', en: 'Costa Rica', pt: 'Costa Rica', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'San José', pt: 'San José' } },
    { code: 'HR', en: 'Croatia', pt: 'Croácia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Zagreb', pt: 'Zagreb' } },
    { code: 'CU', en: 'Cuba', pt: 'Cuba', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Havana', pt: 'Havana' } },
    { code: 'CY', en: 'Cyprus', pt: 'Chipre', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Nicosia', pt: 'Nicósia' } },
    { code: 'CZ', en: 'Czech Republic', pt: 'República Tcheca', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Prague', pt: 'Praga' } },
    { code: 'CI', en: 'Côte d\'Ivoire', pt: 'Costa do Marfim', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Yamoussoukro', pt: 'Yamoussoukro' } },
    { code: 'DK', en: 'Denmark', pt: 'Dinamarca', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Copenhagen', pt: 'Copenhague' } },
    { code: 'DJ', en: 'Djibouti', pt: 'Djibuti', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Djibouti', pt: 'Djibuti' } },
    { code: 'DM', en: 'Dominica', pt: 'Dominica', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Roseau', pt: 'Roseau' } },
    { code: 'DO', en: 'Dominican Republic', pt: 'República Dominicana', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Santo Domingo', pt: 'Santo Domingo' } },
    { code: 'EC', en: 'Ecuador', pt: 'Equador', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Quito', pt: 'Quito' } },
    { code: 'EG', en: 'Egypt', pt: 'Egito', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Cairo', pt: 'Cairo' } },
    { code: 'SV', en: 'El Salvador', pt: 'El Salvador', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'San Salvador', pt: 'San Salvador' } },
    { code: 'GQ', en: 'Equatorial Guinea', pt: 'Guiné Equatorial', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Malabo', pt: 'Malabo' } },
    { code: 'ER', en: 'Eritrea', pt: 'Eritreia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Asmara', pt: 'Asmara' } },
    { code: 'EE', en: 'Estonia', pt: 'Estônia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Tallinn', pt: 'Tallinn' } },
    { code: 'SZ', en: 'Eswatini', pt: 'Eswatini', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Mbabane', pt: 'Mbabane' } },
    { code: 'ET', en: 'Ethiopia', pt: 'Etiópia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Addis Ababa', pt: 'Adis Abeba' } },
    { code: 'FJ', en: 'Fiji', pt: 'Fiji', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Suva', pt: 'Suva' } },
    { code: 'FI', en: 'Finland', pt: 'Finlândia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Helsinki', pt: 'Helsinque' } },
    { code: 'FR', en: 'France', pt: 'França', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Paris', pt: 'Paris' } },
    { code: 'GA', en: 'Gabon', pt: 'Gabão', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Libreville', pt: 'Libreville' } },
    { code: 'GM', en: 'Gambia', pt: 'Gâmbia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Banjul', pt: 'Banjul' } },
    { code: 'GE', en: 'Georgia', pt: 'Geórgia', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Tbilisi', pt: 'Tbilisi' } },
    { code: 'DE', en: 'Germany', pt: 'Alemanha', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Berlin', pt: 'Berlim' } },
    { code: 'GH', en: 'Ghana', pt: 'Gana', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Accra', pt: 'Acra' } },
    { code: 'GR', en: 'Greece', pt: 'Grécia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Athens', pt: 'Atenas' } },
    { code: 'GD', en: 'Grenada', pt: 'Granada', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'St. George\'s', pt: 'St. George\'s' } },
    { code: 'GT', en: 'Guatemala', pt: 'Guatemala', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Guatemala City', pt: 'Cidade da Guatemala' } },
    { code: 'GN', en: 'Guinea', pt: 'Guiné', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Conakry', pt: 'Conacri' } },
    { code: 'GW', en: 'Guinea-Bissau', pt: 'Guiné-Bissau', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Bissau', pt: 'Bissau' } },
    { code: 'GY', en: 'Guyana', pt: 'Guiana', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Georgetown', pt: 'Georgetown' } },
    { code: 'HT', en: 'Haiti', pt: 'Haiti', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Port-au-Prince', pt: 'Porto Príncipe' } },
    { code: 'HN', en: 'Honduras', pt: 'Honduras', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Tegucigalpa', pt: 'Tegucigalpa' } },
    { code: 'HU', en: 'Hungary', pt: 'Hungria', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Budapest', pt: 'Budapeste' } },
    { code: 'IS', en: 'Iceland', pt: 'Islândia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Reykjavik', pt: 'Reiquiavique' } },
    { code: 'IN', en: 'India', pt: 'Índia', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'New Delhi', pt: 'Nova Déli' } },
    { code: 'ID', en: 'Indonesia', pt: 'Indonésia', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Jakarta', pt: 'Jacarta' } },
    { code: 'IR', en: 'Iran', pt: 'Irã', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Tehran', pt: 'Teerã' } },
    { code: 'IQ', en: 'Iraq', pt: 'Iraque', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Baghdad', pt: 'Bagdá' } },
    { code: 'IE', en: 'Ireland', pt: 'Irlanda', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Dublin', pt: 'Dublin' } },
    { code: 'IL', en: 'Israel', pt: 'Israel', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Jerusalem', pt: 'Jerusalém' } },
    { code: 'IT', en: 'Italy', pt: 'Itália', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Rome', pt: 'Roma' } },
    { code: 'JM', en: 'Jamaica', pt: 'Jamaica', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Kingston', pt: 'Kingston' } },
    { code: 'JP', en: 'Japan', pt: 'Japão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Tokyo', pt: 'Tóquio' } },
    { code: 'JO', en: 'Jordan', pt: 'Jordânia', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Amman', pt: 'Amã' } },
    { code: 'KZ', en: 'Kazakhstan', pt: 'Cazaquistão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Astana', pt: 'Astana' } },
    { code: 'KE', en: 'Kenya', pt: 'Quênia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Nairobi', pt: 'Nairóbi' } },
    { code: 'KI', en: 'Kiribati', pt: 'Kiribati', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Tarawa', pt: 'Taraua' } },
    { code: 'KP', en: 'North Korea', pt: 'Coreia do Norte', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Pyongyang', pt: 'Pyongyang' } },
    { code: 'KR', en: 'South Korea', pt: 'Coreia do Sul', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Seoul', pt: 'Seul' } },
    { code: 'KW', en: 'Kuwait', pt: 'Kuwait', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Kuwait City', pt: 'Cidade do Kuwait' } },
    { code: 'KG', en: 'Kyrgyzstan', pt: 'Quirguistão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Bishkek', pt: 'Bishkek' } },
    { code: 'LA', en: 'Laos', pt: 'Laos', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Vientiane', pt: 'Vientiane' } },
    { code: 'LV', en: 'Latvia', pt: 'Letônia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Riga', pt: 'Riga' } },
    { code: 'LB', en: 'Lebanon', pt: 'Líbano', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Beirut', pt: 'Beirute' } },
    { code: 'LS', en: 'Lesotho', pt: 'Lesoto', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Maseru', pt: 'Maseru' } },
    { code: 'LR', en: 'Liberia', pt: 'Libéria', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Monrovia', pt: 'Monróvia' } },
    { code: 'LY', en: 'Libya', pt: 'Líbia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Tripoli', pt: 'Trípoli' } },
    { code: 'LI', en: 'Liechtenstein', pt: 'Liechtenstein', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Vaduz', pt: 'Vaduz' } },
    { code: 'LT', en: 'Lithuania', pt: 'Lituânia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Vilnius', pt: 'Vilnius' } },
    { code: 'LU', en: 'Luxembourg', pt: 'Luxemburgo', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Luxembourg', pt: 'Luxemburgo' } },
    { code: 'MG', en: 'Madagascar', pt: 'Madagáscar', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Antananarivo', pt: 'Antananarivo' } },
    { code: 'MW', en: 'Malawi', pt: 'Malawi', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Lilongwe', pt: 'Lilongwe' } },
    { code: 'MY', en: 'Malaysia', pt: 'Malásia', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Kuala Lumpur', pt: 'Kuala Lumpur' } },
    { code: 'MV', en: 'Maldives', pt: 'Maldivas', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Malé', pt: 'Malé' } },
    { code: 'ML', en: 'Mali', pt: 'Mali', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Bamako', pt: 'Bamako' } },
    { code: 'MT', en: 'Malta', pt: 'Malta', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Valletta', pt: 'Valeta' } },
    { code: 'MH', en: 'Marshall Islands', pt: 'Ilhas Marshall', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Majuro', pt: 'Majuro' } },
    { code: 'MR', en: 'Mauritania', pt: 'Mauritânia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Nouakchott', pt: 'Nouakchott' } },
    { code: 'MU', en: 'Mauritius', pt: 'Maurícia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Port Louis', pt: 'Port Louis' } },
    { code: 'MX', en: 'Mexico', pt: 'México', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Mexico City', pt: 'Cidade do México' } },
    { code: 'FM', en: 'Micronesia', pt: 'Micronésia', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Palikir', pt: 'Palikir' } },
    { code: 'MD', en: 'Moldova', pt: 'Moldávia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Chișinău', pt: 'Chisinau' } },
    { code: 'MC', en: 'Monaco', pt: 'Mônaco', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Monaco', pt: 'Mônaco' } },
    { code: 'MN', en: 'Mongolia', pt: 'Mongólia', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Ulaanbaatar', pt: 'Ulaanbaatar' } },
    { code: 'ME', en: 'Montenegro', pt: 'Montenegro', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Podgorica', pt: 'Podgorica' } },
    { code: 'MA', en: 'Morocco', pt: 'Marrocos', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Rabat', pt: 'Rabat' } },
    { code: 'MZ', en: 'Mozambique', pt: 'Moçambique', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Maputo', pt: 'Maputo' } },
    { code: 'MM', en: 'Myanmar', pt: 'Mianmar', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Naypyidaw', pt: 'Naypyidaw' } },
    { code: 'NA', en: 'Namibia', pt: 'Namíbia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Windhoek', pt: 'Windhoek' } },
    { code: 'NR', en: 'Nauru', pt: 'Nauru', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Yaren', pt: 'Yaren' } },
    { code: 'NP', en: 'Nepal', pt: 'Nepal', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Kathmandu', pt: 'Catmandu' } },
    { code: 'NL', en: 'Netherlands', pt: 'Países Baixos', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Amsterdam', pt: 'Amsterdã' } },
    { code: 'NZ', en: 'New Zealand', pt: 'Nova Zelândia', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Wellington', pt: 'Wellington' } },
    { code: 'NI', en: 'Nicaragua', pt: 'Nicarágua', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Managua', pt: 'Manágua' } },
    { code: 'NE', en: 'Niger', pt: 'Níger', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Niamey', pt: 'Niamey' } },
    { code: 'NG', en: 'Nigeria', pt: 'Nigéria', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Abuja', pt: 'Abuja' } },
    { code: 'MK', en: 'North Macedonia', pt: 'Macedônia do Norte', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Skopje', pt: 'Skopje' } },
    { code: 'NO', en: 'Norway', pt: 'Noruega', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Oslo', pt: 'Oslo' } },
    { code: 'OM', en: 'Oman', pt: 'Omã', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Muscat', pt: 'Mascate' } },
    { code: 'PK', en: 'Pakistan', pt: 'Paquistão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Islamabad', pt: 'Islamabad' } },
    { code: 'PW', en: 'Palau', pt: 'Palau', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Ngerulmud', pt: 'Ngerulmud' } },
    { code: 'PS', en: 'Palestine', pt: 'Palestina', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Ramallah', pt: 'Ramallah' } },
    { code: 'PA', en: 'Panama', pt: 'Panamá', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Panama City', pt: 'Cidade do Panamá' } },
    { code: 'PG', en: 'Papua New Guinea', pt: 'Papua-Nova Guiné', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Port Moresby', pt: 'Port Moresby' } },
    { code: 'PY', en: 'Paraguay', pt: 'Paraguai', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Asunción', pt: 'Assunção' } },
    { code: 'PE', en: 'Peru', pt: 'Peru', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Lima', pt: 'Lima' } },
    { code: 'PH', en: 'Philippines', pt: 'Filipinas', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Manila', pt: 'Manila' } },
    { code: 'PL', en: 'Poland', pt: 'Polônia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Warsaw', pt: 'Varsóvia' } },
    { code: 'PT', en: 'Portugal', pt: 'Portugal', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Lisbon', pt: 'Lisboa' } },
    { code: 'QA', en: 'Qatar', pt: 'Catar', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Doha', pt: 'Doha' } },
    { code: 'RO', en: 'Romania', pt: 'Romênia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Bucharest', pt: 'Bucareste' } },
    { code: 'RU', en: 'Russia', pt: 'Rússia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Moscow', pt: 'Moscou' } },
    { code: 'RW', en: 'Rwanda', pt: 'Ruanda', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Kigali', pt: 'Kigali' } },
    { code: 'KN', en: 'Saint Kitts and Nevis', pt: 'São Cristóvão e Nevis', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Basseterre', pt: 'Basseterre' } },
    { code: 'LC', en: 'Saint Lucia', pt: 'Santa Lúcia', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Castries', pt: 'Castries' } },
    { code: 'VC', en: 'Saint Vincent and the Grenadines', pt: 'São Vicente e Granadinas', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Kingstown', pt: 'Kingstown' } },
    { code: 'WS', en: 'Samoa', pt: 'Samoa', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Apia', pt: 'Apia' } },
    { code: 'SM', en: 'San Marino', pt: 'San Marino', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'San Marino', pt: 'San Marino' } },
    { code: 'ST', en: 'São Tomé and Príncipe', pt: 'São Tomé e Príncipe', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'São Tomé', pt: 'São Tomé' } },
    { code: 'SA', en: 'Saudi Arabia', pt: 'Arábia Saudita', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Riyadh', pt: 'Riade' } },
    { code: 'SN', en: 'Senegal', pt: 'Senegal', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Dakar', pt: 'Dacar' } },
    { code: 'RS', en: 'Serbia', pt: 'Sérvia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Belgrade', pt: 'Belgrado' } },
    { code: 'SC', en: 'Seychelles', pt: 'Seicheles', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Victoria', pt: 'Vitória' } },
    { code: 'SL', en: 'Sierra Leone', pt: 'Serra Leoa', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Freetown', pt: 'Freetown' } },
    { code: 'SG', en: 'Singapore', pt: 'Singapura', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Singapore', pt: 'Singapura' } },
    { code: 'SK', en: 'Slovakia', pt: 'Eslováquia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Bratislava', pt: 'Bratislava' } },
    { code: 'SI', en: 'Slovenia', pt: 'Eslovênia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Ljubljana', pt: 'Liubliana' } },
    { code: 'SB', en: 'Solomon Islands', pt: 'Ilhas Salomão', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Honiara', pt: 'Honiara' } },
    { code: 'SO', en: 'Somalia', pt: 'Somália', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Mogadishu', pt: 'Mogadíscio' } },
    { code: 'ZA', en: 'South Africa', pt: 'África do Sul', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Pretoria', pt: 'Pretória' } },
    { code: 'SS', en: 'South Sudan', pt: 'Sudão do Sul', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Juba', pt: 'Juba' } },
    { code: 'ES', en: 'Spain', pt: 'Espanha', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Madrid', pt: 'Madri' } },
    { code: 'LK', en: 'Sri Lanka', pt: 'Sri Lanka', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Sri Jayawardenepura Kotte', pt: 'Sri Jayawardenepura Kotte' } },
    { code: 'SD', en: 'Sudan', pt: 'Sudão', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Khartoum', pt: 'Cartum' } },
    { code: 'SR', en: 'Suriname', pt: 'Suriname', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Paramaribo', pt: 'Paramaribo' } },
    { code: 'SE', en: 'Sweden', pt: 'Suécia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Stockholm', pt: 'Estocolmo' } },
    { code: 'CH', en: 'Switzerland', pt: 'Suíça', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Bern', pt: 'Berna' } },
    { code: 'SY', en: 'Syria', pt: 'Síria', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Damascus', pt: 'Damasco' } },
    { code: 'TJ', en: 'Tajikistan', pt: 'Tajiquistão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Dushanbe', pt: 'Duchambe' } },
    { code: 'TZ', en: 'Tanzania', pt: 'Tanzânia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Dodoma', pt: 'Dodoma' } },
    { code: 'TH', en: 'Thailand', pt: 'Tailândia', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Bangkok', pt: 'Banguecoque' } },
    { code: 'TL', en: 'Timor-Leste', pt: 'Timor-Leste', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Dili', pt: 'Díli' } },
    { code: 'TG', en: 'Togo', pt: 'Togo', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Lomé', pt: 'Lomé' } },
    { code: 'TO', en: 'Tonga', pt: 'Tonga', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Nuku\'alofa', pt: 'Nuku\'alofa' } },
    { code: 'TT', en: 'Trinidad and Tobago', pt: 'Trinidad e Tobago', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Port of Spain', pt: 'Porto de Espanha' } },
    { code: 'TN', en: 'Tunisia', pt: 'Tunísia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Tunis', pt: 'Túnis' } },
    { code: 'TR', en: 'Turkey', pt: 'Turquia', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Ankara', pt: 'Ancara' } },
    { code: 'TM', en: 'Turkmenistan', pt: 'Turcomenistão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Ashgabat', pt: 'Asgabate' } },
    { code: 'TV', en: 'Tuvalu', pt: 'Tuvalu', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Funafuti', pt: 'Funafuti' } },
    { code: 'UG', en: 'Uganda', pt: 'Uganda', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Kampala', pt: 'Kampala' } },
    { code: 'UA', en: 'Ukraine', pt: 'Ucrânia', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Kyiv', pt: 'Kiev' } },
    { code: 'AE', en: 'United Arab Emirates', pt: 'Emirados Árabes Unidos', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Abu Dhabi', pt: 'Abu Dhabi' } },
    { code: 'GB', en: 'United Kingdom', pt: 'Reino Unido', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'London', pt: 'Londres' } },
    { code: 'US', en: 'United States', pt: 'Estados Unidos', continent: { en: 'North America', pt: 'América do Norte' }, capital: { en: 'Washington, D.C.', pt: 'Washington, D.C.' } },
    { code: 'UY', en: 'Uruguay', pt: 'Uruguai', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Montevideo', pt: 'Montevidéu' } },
    { code: 'UZ', en: 'Uzbekistan', pt: 'Uzbequistão', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Tashkent', pt: 'Tashkent' } },
    { code: 'VU', en: 'Vanuatu', pt: 'Vanuatu', continent: { en: 'Oceania', pt: 'Oceania' }, capital: { en: 'Port Vila', pt: 'Port Vila' } },
    { code: 'VA', en: 'Vatican City', pt: 'Cidade do Vaticano', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Vatican City', pt: 'Cidade do Vaticano' } },
    { code: 'VE', en: 'Venezuela', pt: 'Venezuela', continent: { en: 'South America', pt: 'América do Sul' }, capital: { en: 'Caracas', pt: 'Caracas' } },
    { code: 'VN', en: 'Vietnam', pt: 'Vietnã', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Hanoi', pt: 'Hanói' } },
    { code: 'YE', en: 'Yemen', pt: 'Iêmen', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Sana\'a', pt: 'Sanaa' } },
    { code: 'ZM', en: 'Zambia', pt: 'Zâmbia', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Lusaka', pt: 'Lusaka' } },
    { code: 'ZW', en: 'Zimbabwe', pt: 'Zimbábue', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'Harare', pt: 'Harare' } },
    { code: 'TW', en: 'Taiwan', pt: 'Taiwan', continent: { en: 'Asia', pt: 'Ásia' }, capital: { en: 'Taipei', pt: 'Taipei' } },
    { code: 'XK', en: 'Kosovo', pt: 'Kosovo', continent: { en: 'Europe', pt: 'Europa' }, capital: { en: 'Pristina', pt: 'Pristina' } },
    { code: 'EH', en: 'Western Sahara', pt: 'Saara Ocidental', continent: { en: 'Africa', pt: 'África' }, capital: { en: 'El Aaiún', pt: 'El Aaiún' } },
  ];

  // Extended Brazilian states data with regions and capitals
  const brazilianStates = [
    { code: 'AC', en: 'Acre', pt: 'Acre', flag: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bandeira_do_Acre.svg', region: { en: 'North', pt: 'Norte' }, capital: { en: 'Rio Branco', pt: 'Rio Branco' } },
    { code: 'AL', en: 'Alagoas', pt: 'Alagoas', flag: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Bandeira_de_Alagoas.svg', region: { en: 'Northeast', pt: 'Nordeste' }, capital: { en: 'Maceió', pt: 'Maceió' } },
    { code: 'AP', en: 'Amapá', pt: 'Amapá', flag: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Bandeira_do_Amapá.svg', region: { en: 'North', pt: 'Norte' }, capital: { en: 'Macapá', pt: 'Macapá' } },
    { code: 'AM', en: 'Amazonas', pt: 'Amazonas', flag: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bandeira_do_Amazonas.svg', region: { en: 'North', pt: 'Norte' }, capital: { en: 'Manaus', pt: 'Manaus' } },
    { code: 'BA', en: 'Bahia', pt: 'Bahia', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Bandeira_da_Bahia.svg', region: { en: 'Northeast', pt: 'Nordeste' }, capital: { en: 'Salvador', pt: 'Salvador' } },
    { code: 'CE', en: 'Ceará', pt: 'Ceará', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Bandeira_do_Ceará.svg', region: { en: 'Northeast', pt: 'Nordeste' }, capital: { en: 'Fortaleza', pt: 'Fortaleza' } },
    { code: 'DF', en: 'Federal District', pt: 'Distrito Federal', flag: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Bandeira_do_Distrito_Federal_%28Brasil%29.svg', region: { en: 'Central-West', pt: 'Centro-Oeste' }, capital: { en: 'Brasília', pt: 'Brasília' } },
    { code: 'ES', en: 'Espírito Santo', pt: 'Espírito Santo', flag: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Bandeira_do_Espírito_Santo.svg', region: { en: 'Southeast', pt: 'Sudeste' }, capital: { en: 'Vitória', pt: 'Vitória' } },
    { code: 'GO', en: 'Goiás', pt: 'Goiás', flag: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_Goiás.svg', region: { en: 'Central-West', pt: 'Centro-Oeste' }, capital: { en: 'Goiânia', pt: 'Goiânia' } },
    { code: 'MA', en: 'Maranhão', pt: 'Maranhão', flag: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Bandeira_do_Maranhão.svg', region: { en: 'Northeast', pt: 'Nordeste' }, capital: { en: 'São Luís', pt: 'São Luís' } },
    { code: 'MT', en: 'Mato Grosso', pt: 'Mato Grosso', flag: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bandeira_de_Mato_Grosso.svg', region: { en: 'Central-West', pt: 'Centro-Oeste' }, capital: { en: 'Cuiabá', pt: 'Cuiabá' } },
    { code: 'MS', en: 'Mato Grosso do Sul', pt: 'Mato Grosso do Sul', flag: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Bandeira_de_Mato_Grosso_do_Sul.svg', region: { en: 'Central-West', pt: 'Centro-Oeste' }, capital: { en: 'Campo Grande', pt: 'Campo Grande' } },
    { code: 'MG', en: 'Minas Gerais', pt: 'Minas Gerais', flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Bandeira_de_Minas_Gerais.svg', region: { en: 'Southeast', pt: 'Sudeste' }, capital: { en: 'Belo Horizonte', pt: 'Belo Horizonte' } },
    { code: 'PA', en: 'Pará', pt: 'Pará', flag: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Bandeira_do_Pará.svg', region: { en: 'North', pt: 'Norte' }, capital: { en: 'Belém', pt: 'Belém' } },
    { code: 'PB', en: 'Paraíba', pt: 'Paraíba', flag: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Paraíba.svg', region: { en: 'Northeast', pt: 'Nordeste' }, capital: { en: 'João Pessoa', pt: 'João Pessoa' } },
    { code: 'PR', en: 'Paraná', pt: 'Paraná', flag: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Bandeira_do_Paraná.svg', region: { en: 'South', pt: 'Sul' }, capital: { en: 'Curitiba', pt: 'Curitiba' } },
    { code: 'PE', en: 'Pernambuco', pt: 'Pernambuco', flag: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Bandeira_de_Pernambuco.svg', region: { en: 'Northeast', pt: 'Nordeste' }, capital: { en: 'Recife', pt: 'Recife' } },
    { code: 'PI', en: 'Piauí', pt: 'Piauí', flag: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Bandeira_do_Piauí.svg', region: { en: 'Northeast', pt: 'Nordeste' }, capital: { en: 'Teresina', pt: 'Teresina' } },
    { code: 'RJ', en: 'Rio de Janeiro', pt: 'Rio de Janeiro', flag: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg', region: { en: 'Southeast', pt: 'Sudeste' }, capital: { en: 'Rio de Janeiro', pt: 'Rio de Janeiro' } },
    { code: 'RN', en: 'Rio Grande do Norte', pt: 'Rio Grande do Norte', flag: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bandeira_do_Rio_Grande_do_Norte.svg', region: { en: 'Northeast', pt: 'Nordeste' }, capital: { en: 'Natal', pt: 'Natal' } },
    { code: 'RS', en: 'Rio Grande do Sul', pt: 'Rio Grande do Sul', flag: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Bandeira_do_Rio_Grande_do_Sul.svg', region: { en: 'South', pt: 'Sul' }, capital: { en: 'Porto Alegre', pt: 'Porto Alegre' } },
    { code: 'RO', en: 'Rondônia', pt: 'Rondônia', flag: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Bandeira_de_Rondônia.svg', region: { en: 'North', pt: 'Norte' }, capital: { en: 'Porto Velho', pt: 'Porto Velho' } },
    { code: 'RR', en: 'Roraima', pt: 'Roraima', flag: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Bandeira_de_Roraima.svg', region: { en: 'North', pt: 'Norte' }, capital: { en: 'Boa Vista', pt: 'Boa Vista' } },
    { code: 'SC', en: 'Santa Catarina', pt: 'Santa Catarina', flag: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Bandeira_de_Santa_Catarina.svg', region: { en: 'South', pt: 'Sul' }, capital: { en: 'Florianópolis', pt: 'Florianópolis' } },
    { code: 'SP', en: 'São Paulo', pt: 'São Paulo', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Bandeira_do_estado_de_São_Paulo.svg', region: { en: 'Southeast', pt: 'Sudeste' }, capital: { en: 'São Paulo', pt: 'São Paulo' } },
    { code: 'SE', en: 'Sergipe', pt: 'Sergipe', flag: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Sergipe.svg', region: { en: 'Northeast', pt: 'Nordeste' }, capital: { en: 'Aracaju', pt: 'Aracaju' } },
    { code: 'TO', en: 'Tocantins', pt: 'Tocantins', flag: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Bandeira_do_Tocantins.svg', region: { en: 'North', pt: 'Norte' }, capital: { en: 'Palmas', pt: 'Palmas' } }
  ];

  useEffect(() => {
    const portugueseSpeaking = new Set(['BR', 'PT', 'AO', 'MZ', 'GW', 'TL', 'GQ', 'CV', 'ST']);
    const userLang = navigator.language.split('-')[0];
    const userCountry = navigator.language.split('-')[1];

    try {
      const savedState = JSON.parse(localStorage.getItem('flagQuizState') || '{}');
      if (savedState.language) setLanguage(savedState.language);
      else if (userLang === 'pt' || portugueseSpeaking.has(userCountry)) {
        setLanguage('pt');
      }

      if (savedState.autoAdvance !== undefined) setAutoAdvance(savedState.autoAdvance);
      if (savedState.autoAdvanceSeconds) setAutoAdvanceSeconds(savedState.autoAdvanceSeconds);
    } catch (e) {
      if (userLang === 'pt' || portugueseSpeaking.has(userCountry)) {
        setLanguage('pt');
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      language,
      autoAdvance,
      autoAdvanceSeconds,
    };
    localStorage.setItem('flagQuizState', JSON.stringify(stateToSave));
  }, [language, autoAdvance, autoAdvanceSeconds]);

  useEffect(() => {
    if (selectedAnswer !== null && autoAdvance && !multiQuestionMode) {
      const timeoutId = setTimeout(() => {
        generateQuestion();
      }, autoAdvanceSeconds * 1000);
      setTimer(timeoutId);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedAnswer, autoAdvance, autoAdvanceSeconds, multiQuestionMode]);

  const handleModeSelection = (mode) => {
    setQuizMode(mode);
    setShowQuestionTypeSelection(true);
  };

  const handleStartQuiz = () => {
    const selectedCount = Object.values(questionTypes).filter(Boolean).length;
    if (selectedCount === 0) {
      setQuestionTypes({ name: true, continentOrRegion: false, capital: false });
    }

    setMultiQuestionMode(selectedCount > 1);
    setShowQuestionTypeSelection(false);
    generateQuestion();
  };

  const generateQuestion = () => {
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setCurrentQuestionSet([]);
    setQuestionSetAnswers([]);
    if (timer) clearTimeout(timer);

    const dataSet = quizMode === 'countries' ? countries : brazilianStates;

    if (usedFlags.length >= dataSet.length) {
      setShowComplete(true);
      return;
    }

    const availableFlags = dataSet.filter(item => !usedFlags.includes(item.code));
    const correctItem = availableFlags[Math.floor(Math.random() * availableFlags.length)];

    // Build question set based on selected types
    const questions = [];

    if (questionTypes.name) {
      const wrongItems = [];
      while (wrongItems.length < 3) {
        const random = dataSet[Math.floor(Math.random() * dataSet.length)];
        if (random.code !== correctItem.code && !wrongItems.includes(random)) {
          wrongItems.push(random);
        }
      }
      const options = [...wrongItems, correctItem].sort(() => Math.random() - 0.5);
      questions.push({
        type: 'name',
        correct: correctItem,
        options: options
      });
    }

    if (questionTypes.continentOrRegion) {
      const continentOrRegionKey = quizMode === 'countries' ? 'continent' : 'region';
      const allContinentsOrRegions = [...new Set(dataSet.map(item => item[continentOrRegionKey][language]))];
      const correctContinentOrRegion = correctItem[continentOrRegionKey][language];

      const wrongContinentsOrRegions = allContinentsOrRegions
        .filter(cr => cr !== correctContinentOrRegion)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [...wrongContinentsOrRegions, correctContinentOrRegion].sort(() => Math.random() - 0.5);

      questions.push({
        type: 'continentOrRegion',
        correct: correctContinentOrRegion,
        options: options,
        correctItem: correctItem
      });
    }

    if (questionTypes.capital) {
      const allCapitals = dataSet
        .filter(item => item.capital)
        .map(item => ({ code: item.code, capital: item.capital[language] }));

      const wrongCapitals = allCapitals
        .filter(item => item.code !== correctItem.code)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [
        ...wrongCapitals.map(item => item.capital),
        correctItem.capital[language]
      ].sort(() => Math.random() - 0.5);

      questions.push({
        type: 'capital',
        correct: correctItem.capital[language],
        options: options,
        correctItem: correctItem
      });
    }

    setCurrentQuestion(correctItem);
    setCurrentQuestionSet(questions);
    setUsedFlags([...usedFlags, correctItem.code]);
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    const currentQ = currentQuestionSet[currentQuestionIndex];
    const isCorrect = currentQ.type === 'name'
      ? answer.code === currentQ.correct.code
      : answer === currentQ.correct;

    const newAnswers = [...questionSetAnswers, isCorrect];
    setQuestionSetAnswers(newAnswers);
    setSelectedAnswer(answer);

    // Check if this is the last question in the set
    if (currentQuestionIndex >= currentQuestionSet.length - 1) {
      // All questions answered - count score
      const allCorrect = newAnswers.every(a => a);
      if (allCorrect) {
        setScore(score + 1);
      } else {
        setWrongAnswers(wrongAnswers + 1);
      }

      // Auto advance or show next button
      if (autoAdvance) {
        const timeoutId = setTimeout(() => {
          generateQuestion();
        }, autoAdvanceSeconds * 1000);
        setTimer(timeoutId);
      }
    } else if (autoAdvance) {
        const timeoutId = setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
        }, autoAdvanceSeconds * 1000);
        setTimer(timeoutId);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestionSet.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      generateQuestion();
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
    setShowQuestionTypeSelection(false);
    setQuestionTypes({ name: true, continentOrRegion: false, capital: false });
    setMultiQuestionMode(false);
    setCurrentQuestionIndex(0);
    setCurrentQuestionSet([]);
    setQuestionSetAnswers([]);
  };

  const handleRestart = () => {
    setScore(0);
    setWrongAnswers(0);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setUsedFlags([]);
    setShowComplete(false);
    setCurrentQuestionIndex(0);
    setCurrentQuestionSet([]);
    setQuestionSetAnswers([]);
    setTimeout(() => generateQuestion(), 100);
  };

  const t = translations[language];

  // Mode selection screen
  if (!quizMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-indigo-600 text-center mb-8">{t.title}</h1>
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-8">{t.selectMode}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleModeSelection('countries')}
                className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Globe className="w-16 h-16 mx-auto mb-4" />
                <span className="text-2xl font-bold">{t.countriesMode}</span>
              </button>

              <button
                onClick={() => handleModeSelection('brazil')}
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

  // Question type selection screen
  if (showQuestionTypeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-indigo-600 text-center mb-8">{t.selectQuestionTypes}</h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  id="name"
                  checked={questionTypes.name}
                  onChange={(e) => setQuestionTypes({...questionTypes, name: e.target.checked})}
                  className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="name" className="text-xl font-medium text-gray-700 cursor-pointer flex-1">
                  {t.name}
                </label>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  id="continentOrRegion"
                  checked={questionTypes.continentOrRegion}
                  onChange={(e) => setQuestionTypes({...questionTypes, continentOrRegion: e.target.checked})}
                  className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="continentOrRegion" className="text-xl font-medium text-gray-700 cursor-pointer flex-1">
                  {quizMode === 'countries' ? t.continent : t.region}
                </label>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  id="capital"
                  checked={questionTypes.capital}
                  onChange={(e) => setQuestionTypes({...questionTypes, capital: e.target.checked})}
                  className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="capital" className="text-xl font-medium text-gray-700 cursor-pointer flex-1">
                  {t.capital}
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBackToMenu}
                className="flex-1 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                {t.backToMenu}
              </button>
              <button
                onClick={handleStartQuiz}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {t.startQuiz}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz complete screen
  if (showComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
            <h2 className="text-4xl font-bold text-indigo-600 mb-4">{t.quizComplete}</h2>
            <p className="text-2xl text-gray-700 mb-8">
              {t.finalScore}: {score} / {score + wrongAnswers}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBackToMenu}
                className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                {t.backToMenu}
              </button>
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {t.restart}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main quiz screen
  const currentQ = currentQuestionSet[currentQuestionIndex];

  const getQuestionText = () => {
    if (!currentQ) return '';

    switch (currentQ.type) {
      case 'name':
        return quizMode === 'countries' ? t.whichCountry : t.whichState;
      case 'continentOrRegion':
        return quizMode === 'countries' ? t.whatIsTheContinent : t.whatIsTheRegion;
      case 'capital':
        return t.whatIsTheCapital;
      default:
        return '';
    }
  };

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

          {currentQuestion && currentQ && (
            <div>
              {currentQuestionSet.length > 1 && (
                <p className="text-center text-sm mb-2 text-gray-500">
                  {t.questionProgress
                    .replace('{current}', (currentQuestionIndex + 1).toString())
                    .replace('{total}', currentQuestionSet.length.toString())}
                </p>
              )}

              <p className="text-center text-lg mb-4 text-gray-700 font-medium">
                {getQuestionText()}
              </p>

              <div className="flex justify-center mb-6">
                <div className="w-80 h-56 flex items-center justify-center bg-gray-50 rounded-lg shadow-lg border-4 border-gray-200">
                  <img
                    src={quizMode === 'countries'
                      ? `https://flagcdn.com/w320/${currentQuestion.code.toLowerCase()}.png`
                      : currentQuestion.flag}
                    alt="Flag"
                    className="max-w-full max-h-full object-contain p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                {currentQ.options.map((option, idx) => {
                  const displayText = currentQ.type === 'name' ? option[language] : option;
                  const isSelected = currentQ.type === 'name'
                    ? selectedAnswer?.code === option.code
                    : selectedAnswer === option;
                  const isCorrect = currentQ.type === 'name'
                    ? option.code === currentQ.correct.code
                    : option === currentQ.correct;
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
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={buttonClass}
                    >
                      {displayText}
                    </button>
                  );
                })}
              </div>

              {!autoAdvance && selectedAnswer !== null && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  {t.next}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlagQuizApp;
