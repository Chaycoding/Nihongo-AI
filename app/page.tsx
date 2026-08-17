'use client'

import { useState } from 'react';
import { evaluateJapanese } from './actions';
import { CheckCircle2, XCircle, Volume2, ArrowRight, Languages } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await evaluateJapanese(input);
      setResult(data);
    } catch (error) {
      alert("Error connecting to the model.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center p-4 font-sans text-zinc-900 selection:bg-zinc-300">
      
      <div className="w-full max-w-4xl bg-white border border-zinc-300 rounded-xl shadow-sm overflow-hidden">
        
        {/* Minimalist Header */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-black" />
            <h1 className="font-semibold text-zinc-700 tracking-wider uppercase text-sm">Nihongo Analysis Engine</h1>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            STATUS: {loading ? 'PROCESSING...' : 'IDLE'}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Japanese text..."
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-5 py-4 outline-none focus:border-zinc-400 focus:bg-white transition-all text-lg placeholder:text-zinc-400"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              {loading ? 'Analyzing' : 'Execute'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Results Area */}
        {result && (
          <div className="border-t border-zinc-200 bg-zinc-50 p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-300">
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Status Icon */}
              <div className="pt-2 hidden md:block">
                {result.is_correct ? (
                  <CheckCircle2 className="w-10 h-10 text-zinc-700" />
                ) : (
                  <XCircle className="w-10 h-10 text-zinc-400" />
                )}
              </div>

              {/* Right Column: Data */}
              <div className="flex-1 space-y-8">
                
                {/* Core Sentence Info */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      {result.is_correct ? 'Original Input' : 'Suggested Correction'}
                    </span>
                    <span className="text-xs font-medium text-zinc-600 bg-zinc-200/60 px-3 py-1.5 rounded-full">
                      Formality: {result.politeness_level} | Score: {result.feedback.naturalness_score}/10
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <p className="text-3xl font-medium text-zinc-900">
                      {result.is_correct ? result.original_sentence : result.corrected_sentence}
                    </p>
                    <button 
                      onClick={() => playAudio(result.is_correct ? result.original_sentence : result.corrected_sentence)}
                      className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 rounded-full transition-colors"
                      title="Play Audio"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-zinc-500 mt-2 font-medium">{result.romaji}</p>
                </div>

                {/* Translation */}
                <div className="border-l-2 border-zinc-300 pl-4 py-1">
                  <p className="text-zinc-700 italic text-lg">"{result.english_translation}"</p>
                </div>

                {/* Technical Feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-200">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-4">Syntax & Grammar</h3>
                    <ul className="space-y-3">
                      {result.feedback.grammar_notes.map((note: string, i: number) => (
                        <li key={i} className="text-sm text-zinc-600 flex gap-3 leading-relaxed">
                          <span className="text-zinc-400 font-bold">-</span> 
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-4">Optimization Tips</h3>
                    <ul className="space-y-3">
                      {result.feedback.improvement_tips.map((tip: string, i: number) => (
                        <li key={i} className="text-sm text-zinc-600 flex gap-3 leading-relaxed">
                          <span className="text-zinc-400 font-bold">-</span> 
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}