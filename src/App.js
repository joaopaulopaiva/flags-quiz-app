import React, {useState, useEffect, useCallback} from 'react';
import { Settings, Trophy, X, XCircle, Globe, Map, RotateCcw } from 'lucide-react';
import {translations} from "./data/translations";
import {countries} from "./data/countries";
import {brazilianStates} from "./data/brazilianStates";

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
      console.error('Failed to load saved state:', e);
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

  const generateQuestion = useCallback(() => {
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
  }, [timer, quizMode, usedFlags, questionTypes, language]);

  useEffect(() => {
    if (selectedAnswer !== null && autoAdvance && !multiQuestionMode) {
      const timeoutId = setTimeout(() => {
        generateQuestion();
      }, autoAdvanceSeconds * 1000);
      setTimer(timeoutId);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedAnswer, autoAdvance, autoAdvanceSeconds, multiQuestionMode, generateQuestion]);

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
      const allCorrect = newAnswers.every(Boolean);
      if (allCorrect) {
        setScore(score + 1);
      } else {
        setWrongAnswers(wrongAnswers + 1);
      }

      setUsedFlags(prev => [...prev, currentQ.correctItem?.code || currentQ.correct.code]);

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
    setShowSettings(false);
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
  };

useEffect(() => {
  if (!showComplete && quizMode && !showQuestionTypeSelection && currentQuestionSet.length === 0 && !currentQuestion) {
    generateQuestion();
  }
}, [showComplete, quizMode, showQuestionTypeSelection, currentQuestionSet, currentQuestion, generateQuestion]);

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
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 bg-transparent border-0 cursor-default"
                onClick={() => setShowSettings(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowSettings(false);
                  }
                }}
                aria-label="Close settings"
              />
              <div className="absolute right-6 top-16 z-50 w-80 p-4 bg-white rounded-lg border-2 border-gray-200 shadow-2xl">
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
            </>
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
                {currentQ.options.map((option) => {
                  const displayText = currentQ.type === 'name' ? option[language] : option;
                  const uniqueKey = currentQ.type === 'name' ? option.code : option;
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
                      key={uniqueKey}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={buttonClass}
                    >
                      {displayText}
                    </button>
                  );
                })}
              </div>

              {!autoAdvance && (
                <button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    selectedAnswer === null
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
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
