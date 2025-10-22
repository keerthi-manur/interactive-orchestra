import React, { useState, useEffect, useRef } from 'react';
import { PolySynth, Synth, Loop, Transport, start } from 'tone';
import './App.css';


  const themes = {
    cottagecore: {
      name: 'Cottagecore',
      icon: '🌿',
      emoji: '🌸',
      musicians: {
        strings: [
          { id: 'strings-1', name: 'Violin Melody', icon: '🎻', pattern: ['C4', 'E4', 'G4', 'E4'], duration: '4n' },
          { id: 'strings-2', name: 'Cello Bass', icon: '🎻', pattern: ['C3', 'C3', 'G2', 'G2'], duration: '2n' },
          { id: 'strings-3', name: 'Viola Harmony', icon: '🎻', pattern: ['E4', 'G4', 'B4', 'G4'], duration: '4n' },
          { id: 'strings-4', name: 'Pizzicato', icon: '🎻', pattern: ['C5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5', 'G4'], duration: '8n' }
        ],
        brass: [
          { id: 'brass-1', name: 'Trumpet Lead', icon: '🎺', pattern: ['G4', 'G4', 'E4', 'C4'], duration: '4n' },
          { id: 'brass-2', name: 'Trombone', icon: '🎺', pattern: ['C3', 'E3', 'G3', 'C4'], duration: '2n' },
          { id: 'brass-3', name: 'French Horn', icon: '🎺', pattern: ['E3', 'E3', 'D3', 'D3'], duration: '2n' },
          { id: 'brass-4', name: 'Fanfare', icon: '🎺', pattern: ['C4', 'C4', 'C4', 'G3', 'C4', 'E4', 'G4', 'C5'], duration: '8n' }
        ],
        woodwinds: [
          { id: 'woodwinds-1', name: 'Flute Trill', icon: '🎵', pattern: ['E5', 'F5', 'E5', 'D5', 'E5', 'F5', 'E5', 'D5'], duration: '8n' },
          { id: 'woodwinds-2', name: 'Clarinet', icon: '🎵', pattern: ['G4', 'A4', 'B4', 'C5'], duration: '4n' },
          { id: 'woodwinds-3', name: 'Oboe', icon: '🎵', pattern: ['C5', 'B4', 'A4', 'G4'], duration: '4n' },
          { id: 'woodwinds-4', name: 'Bassoon', icon: '🎵', pattern: ['C3', 'D3', 'E3', 'G3', 'E3', 'D3'], duration: '8n' }
        ],
        themed: [
          { id: 'themed-1', name: 'Harp Arpeggios', icon: '🎵', pattern: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4'], duration: '16n' },
          { id: 'themed-2', name: 'Music Box', icon: '🎶', pattern: ['C5', 'E5', 'G5', 'C6'], duration: '8n' },
          { id: 'themed-3', name: 'Bells', icon: '🔔', pattern: ['G5', 'E5', 'C5', 'E5'], duration: '4n' },
          { id: 'themed-4', name: 'Chimes', icon: '🎐', pattern: ['C6', 'D6', 'E6', 'G6', 'E6', 'D6', 'C6', 'G5'], duration: '8n' }
        ]
      },
      synths: {
        strings: { oscillator: { type: 'sine' }, envelope: { attack: 0.4, decay: 0.3, sustain: 0.7, release: 1.5 } },
        brass: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.08, decay: 0.2, sustain: 0.8, release: 0.6 } },
        woodwinds: { oscillator: { type: 'triangle' }, envelope: { attack: 0.15, decay: 0.2, sustain: 0.5, release: 1 } },
        themed: { oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.6, sustain: 0.3, release: 2.5 } }
      }
    },
    electronic: {
      name: 'Electronic',
      icon: '⚡',
      emoji: '🎛️',
      musicians: {
        leads: [
          { id: 'leads-1', name: 'Saw Lead', icon: '⚡', pattern: ['C4', 'E4', 'G4', 'B4'], duration: '8n' },
          { id: 'leads-2', name: 'Square Lead', icon: '⚡', pattern: ['E4', 'G4', 'B4', 'D5'], duration: '8n' },
          { id: 'leads-3', name: 'Pluck', icon: '⚡', pattern: ['C5', 'E5', 'G5', 'C6', 'G5', 'E5'], duration: '16n' },
          { id: 'leads-4', name: 'Arpeggio', icon: '⚡', pattern: ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'E5', 'C5'], duration: '16n' }
        ],
        bass: [
          { id: 'bass-1', name: 'Sub Bass', icon: '🔊', pattern: ['C2', 'C2', 'G1', 'G1'], duration: '2n' },
          { id: 'bass-2', name: 'Wobble Bass', icon: '🔊', pattern: ['C2', 'C2', 'C2', 'C2'], duration: '8n' },
          { id: 'bass-3', name: 'Reese Bass', icon: '🔊', pattern: ['C2', 'E2', 'G2', 'C2'], duration: '4n' },
          { id: 'bass-4', name: 'Acid Bass', icon: '🔊', pattern: ['C2', 'D2', 'E2', 'F2', 'E2', 'D2', 'C2', 'G1'], duration: '16n' }
        ],
        pads: [
          { id: 'pads-1', name: 'Warm Pad', icon: '🌊', pattern: ['C3', 'E3', 'G3'], duration: '1n' },
          { id: 'pads-2', name: 'Ambient Pad', icon: '🌊', pattern: ['E3', 'G3', 'B3'], duration: '1n' },
          { id: 'pads-3', name: 'String Pad', icon: '🌊', pattern: ['G3', 'B3', 'D4'], duration: '1n' },
          { id: 'pads-4', name: 'Choir Pad', icon: '🌊', pattern: ['C3', 'E3', 'G3', 'C4'], duration: '2n' }
        ],
        effects: [
          { id: 'effects-1', name: 'Riser', icon: '📈', pattern: ['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2'], duration: '16n' },
          { id: 'effects-2', name: 'Drop', icon: '💥', pattern: ['C5', 'C4', 'C3', 'C2'], duration: '16n' },
          { id: 'effects-3', name: 'Sweep', icon: '〰️', pattern: ['C6', 'E6', 'G6', 'C7', 'G6', 'E6', 'C6', 'G5'], duration: '32n' },
          { id: 'effects-4', name: 'Glitch', icon: '⚙️', pattern: ['C4', 'C5', 'C4', 'C5', 'C3', 'C5', 'C4', 'C3'], duration: '32n' }
        ]
      },
      synths: {
        leads: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.02, decay: 0.15, sustain: 0.4, release: 0.6 } },
        bass: { oscillator: { type: 'square' }, envelope: { attack: 0.02, decay: 0.2, sustain: 0.8, release: 0.4 } },
        pads: { oscillator: { type: 'sine' }, envelope: { attack: 1.5, decay: 0.8, sustain: 0.8, release: 2.5 } },
        effects: { oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.15, sustain: 0.3, release: 0.8 } }
      }
    },
    rock: {
      name: 'Rock',
      icon: '🎸',
      emoji: '🤘',
      musicians: {
        guitars: [
          { id: 'guitars-1', name: 'Power Chords', icon: '🎸', pattern: ['C2', 'C2', 'G1', 'G1'], duration: '4n' },
          { id: 'guitars-2', name: 'Lead Guitar', icon: '🎸', pattern: ['C4', 'D4', 'Eb4', 'G4', 'Eb4', 'D4', 'C4', 'Bb3'], duration: '8n' },
          { id: 'guitars-3', name: 'Rhythm Guitar', icon: '🎸', pattern: ['C2', 'C2', 'Eb2', 'Eb2', 'G2', 'G2', 'C2', 'G1'], duration: '8n' },
          { id: 'guitars-4', name: 'Palm Mute', icon: '🎸', pattern: ['C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'Eb2', 'G2'], duration: '16n' }
        ],
        bass: [
          { id: 'bass-r-1', name: 'Bass Line', icon: '🎸', pattern: ['C1', 'C1', 'G0', 'G0'], duration: '4n' },
          { id: 'bass-r-2', name: 'Gallop Bass', icon: '🎸', pattern: ['C1', 'C1', 'C1', 'Eb1', 'Eb1', 'Eb1', 'G1', 'G1'], duration: '8t' },
          { id: 'bass-r-3', name: 'Slap Bass', icon: '🎸', pattern: ['C1', 'Eb1', 'G1', 'Eb1'], duration: '8n' },
          { id: 'bass-r-4', name: 'Funk Bass', icon: '🎸', pattern: ['C1', 'C1', 'Eb1', 'Eb1', 'G1', 'G1', 'C1', 'G0'], duration: '16n' }
        ],
        effects: [
          { id: 'effects-rock-1', name: 'Feedback', icon: '🔊', pattern: ['G5', 'G5', 'G#5', 'G5'], duration: '1n' },
          { id: 'effects-rock-2', name: 'Pinch Harmonic', icon: '⚡', pattern: ['E6', 'E6', 'E6', 'E6'], duration: '16n' },
          { id: 'effects-rock-3', name: 'Dive Bomb', icon: '💥', pattern: ['G5', 'F5', 'Eb5', 'D5', 'C5', 'Bb4', 'A4', 'G4'], duration: '32n' },
          { id: 'effects-rock-4', name: 'Whammy', icon: '〰️', pattern: ['C4', 'C5', 'C4', 'C5', 'C4', 'C5', 'C4', 'G4'], duration: '16n' }
        ],
        keys: [
          { id: 'keys-1', name: 'Organ', icon: '🎹', pattern: ['C3', 'Eb3', 'G3', 'C4'], duration: '2n' },
          { id: 'keys-2', name: 'Piano', icon: '🎹', pattern: ['C3', 'Eb3', 'G3', 'Eb3', 'C3', 'G2', 'Eb2', 'C2'], duration: '8n' },
          { id: 'keys-3', name: 'Synth Keys', icon: '🎹', pattern: ['C4', 'D4', 'Eb4', 'G4'], duration: '4n' },
          { id: 'keys-4', name: 'Electric Piano', icon: '🎹', pattern: ['Eb3', 'G3', 'Bb3', 'D4', 'Bb3', 'G3'], duration: '8n' }
        ]
      },
      synths: {
        guitars: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.005, decay: 0.08, sustain: 0.9, release: 0.15 } },
        bass: { oscillator: { type: 'square' }, envelope: { attack: 0.005, decay: 0.08, sustain: 1, release: 0.15 } },
        effects: { oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.15, sustain: 0.6, release: 1 } },
        keys: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.25, sustain: 0.7, release: 0.6 } }
      }
    },
    liminal: {
      name: 'Liminal',
      icon: '🌀',
      emoji: '👁️',
      musicians: {
        pads: [
          { id: 'pads-lim-1', name: 'Void Pad', icon: '🌫️', pattern: ['C2', 'E2', 'G2'], duration: '4n' },
          { id: 'pads-lim-2', name: 'Dreamy Wash', icon: '🌫️', pattern: ['E2', 'G2', 'B2'], duration: '4n' },
          { id: 'pads-lim-3', name: 'Distant Memory', icon: '🌫️', pattern: ['G2', 'B2', 'D3'], duration: '4n' },
          { id: 'pads-lim-4', name: 'Empty Hall', icon: '🌫️', pattern: ['A2', 'C3', 'E3'], duration: '2n' }
        ],
        textures: [
          { id: 'texture-1', name: 'Static Hum', icon: '📺', pattern: ['C4', 'C#4', 'C4', 'B3'], duration: '2n' },
          { id: 'texture-2', name: 'Glitch Memory', icon: '📺', pattern: ['E4', 'E4', 'D4', 'E4'], duration: '4n' },
          { id: 'texture-3', name: 'Vinyl Crackle', icon: '📺', pattern: ['G3', 'G#3', 'G3', 'F#3'], duration: '4n' },
          { id: 'texture-4', name: 'Echo Chamber', icon: '📺', pattern: ['C5', 'G4', 'E4', 'C4'], duration: '2n' }
        ],
        bass: [
          { id: 'bass-lim-1', name: 'Deep Drone', icon: '〰️', pattern: ['C1'], duration: '2n' },
          { id: 'bass-lim-2', name: 'Sub Pulse', icon: '〰️', pattern: ['C1', 'E1'], duration: '4n' },
          { id: 'bass-lim-3', name: 'Rumble', icon: '〰️', pattern: ['C1', 'B0'], duration: '4n' },
          { id: 'bass-lim-4', name: 'Abyss', icon: '〰️', pattern: ['C0'], duration: '1n' }
        ],
        melodies: [
          { id: 'melody-1', name: 'Nostalgia Box', icon: '💫', pattern: ['C5', 'E5', 'G5', 'B5', 'G5', 'E5'], duration: '2n' },
          { id: 'melody-2', name: 'Faded Arpeggio', icon: '💫', pattern: ['E4', 'G4', 'B4', 'E5'], duration: '4n' },
          { id: 'melody-3', name: 'Mall Music', icon: '💫', pattern: ['G4', 'A4', 'B4', 'D5'], duration: '2n' },
          { id: 'melody-4', name: 'Lost Signal', icon: '💫', pattern: ['C5', 'D5', 'E5', 'G5'], duration: '2n' }
        ]
      },
      synths: {
        pads: { oscillator: { type: 'sine' }, envelope: { attack: 3, decay: 2, sustain: 0.95, release: 6 } },
        textures: { oscillator: { type: 'sine' }, envelope: { attack: 0.5, decay: 1, sustain: 0.6, release: 2 } },
        bass: { oscillator: { type: 'sine' }, envelope: { attack: 1.5, decay: 1, sustain: 1, release: 4 } },
        melodies: { oscillator: { type: 'sine' }, envelope: { attack: 0.8, decay: 1, sustain: 0.7, release: 4 } }
      }
    }
  };

function App() {
  const [selectedTheme, setSelectedTheme] = useState('cottagecore');
  const [activeSounds, setActiveSounds] = useState({});
  const [isStarted, setIsStarted] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [showVolume, setShowVolume] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [volumes, setVolumes] = useState({});
  
  const partsRef = useRef({});
  const synthsRef = useRef({});

  useEffect(() => {
    if (!selectedTheme) return;

    const theme = themes[selectedTheme];
    const initVolumes = {};
    Object.keys(theme.musicians).forEach(section => {
      initVolumes[section] = -10;
    });
    setVolumes(initVolumes);

    const initAudio = async () => {
      Object.values(synthsRef.current).forEach(synth => synth?.dispose());
      Object.values(partsRef.current).forEach(part => part?.dispose());
      
      synthsRef.current = {};
      partsRef.current = {};

      Object.entries(theme.musicians).forEach(([section, musicians]) => {
        const synthConfig = theme.synths[section];
        const synth = new PolySynth(Synth, synthConfig).toDestination();
        synth.volume.value = initVolumes[section];
        synthsRef.current[section] = synth;

        musicians.forEach(musician => {
          let patternIndex = 0;
          const loop = new Loop((time) => {
            const note = musician.pattern[patternIndex % musician.pattern.length];
            synth.triggerAttackRelease(note, musician.duration, time);
            patternIndex++;
          }, musician.duration);
          partsRef.current[musician.id] = loop;
        });
      });
    };

    initAudio();

    return () => {
      Object.values(partsRef.current).forEach(loop => loop?.dispose());
      Object.values(synthsRef.current).forEach(synth => synth?.dispose());
    };
  }, [selectedTheme]);

  useEffect(() => {
    if (isStarted) {
      Transport.bpm.value = tempo;
    }
  }, [tempo, isStarted]);

  useEffect(() => {
    Object.keys(volumes).forEach(section => {
      if (synthsRef.current[section]) {
        synthsRef.current[section].volume.value = volumes[section];
      }
    });
  }, [volumes]);

  const toggleMusician = async (musicianId) => {
    if (!isStarted) {
      await start();
      Transport.start();
      setIsStarted(true);
    }

    const isActive = activeSounds[musicianId];
    
    if (isActive) {
      partsRef.current[musicianId]?.stop();
      setActiveSounds(prev => {
        const newState = { ...prev };
        delete newState[musicianId];
        return newState;
      });
    } else {
      partsRef.current[musicianId]?.start(0);
      setActiveSounds(prev => ({ ...prev, [musicianId]: true }));
    }
  };

  const clearAll = () => {
    Object.keys(activeSounds).forEach(id => {
      partsRef.current[id]?.stop();
    });
    setActiveSounds({});
  };

  const resetVolumes = () => {
    if (!selectedTheme) return;
    const newVolumes = {};
    Object.keys(themes[selectedTheme].musicians).forEach(section => {
      newVolumes[section] = -10;
    });
    setVolumes(newVolumes);
  };

  const switchTheme = (themeName) => {
    clearAll();
    setSelectedTheme(themeName);
    setShowThemes(false);
    setShowVolume(false);
  };

  const currentTheme = themes[selectedTheme];
  
  const MusicianButton = ({ musician }) => {
    const isActive = activeSounds[musician.id];
    return (
      <button
        onClick={() => toggleMusician(musician.id)}
        className={`
          relative rounded-lg p-4 transition-all duration-300 cursor-pointer text-center
          ${isActive 
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl scale-105' 
            : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'
          }
        `}
      >
        <div className="text-3xl mb-1">{musician.icon}</div>
        <div className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-200'}`}>
          {musician.name}
        </div>
        {isActive && (
          <div className="absolute inset-0 rounded-lg border-3 border-yellow-300 animate-pulse pointer-events-none" />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900 p-4 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-2">
          {currentTheme.icon} {currentTheme.name} Orchestra
        </h1>
        <p className="text-gray-300 text-sm md:text-lg">Click musicians to add them to your symphony</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Object.entries(currentTheme.musicians).map(([section, musicianList]) => (
            <div key={section} className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
              <h2 className="text-xl font-bold text-amber-300 mb-4 capitalize text-center">
                {section}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {musicianList.map(musician => (
                  <MusicianButton 
                    key={musician.id} 
                    musician={musician}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-amber-300 font-semibold whitespace-nowrap">Tempo:</span>
              <input
                type="range"
                min="60"
                max="180"
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
                className="flex-1 md:w-48"
              />
              <span className="text-gray-300 w-20">{tempo} BPM</span>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  setShowThemes(!showThemes);
                  setShowVolume(false);
                }}
                className="flex-1 md:flex-none px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                🎨 Themes
              </button>
              <button
                onClick={() => {
                  setShowVolume(!showVolume);
                  setShowThemes(false);
                }}
                className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                🎚️ Volume
              </button>
              <button
                onClick={clearAll}
                className="flex-1 md:flex-none px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          
          {showThemes && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-amber-300 font-semibold mb-4 text-center">Choose Your Theme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => switchTheme('cottagecore')}
                  className={`relative bg-gradient-to-br from-green-600 to-emerald-800 hover:from-green-500 hover:to-emerald-700 rounded-lg p-6 transition-all duration-300 ${selectedTheme === 'cottagecore' ? 'ring-4 ring-yellow-400' : ''}`}
                >
                  <div className="text-4xl mb-2">{themes.cottagecore.emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{themes.cottagecore.name}</h3>
                  <p className="text-green-100 text-sm">Classical orchestra with strings, brass, woodwinds & more</p>
                </button>

                <button
                  onClick={() => switchTheme('electronic')}
                  className={`relative bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg p-6 transition-all duration-300 ${selectedTheme === 'electronic' ? 'ring-4 ring-yellow-400' : ''}`}
                >
                  <div className="text-4xl mb-2">{themes.electronic.emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{themes.electronic.name}</h3>
                  <p className="text-purple-100 text-sm">Electronic beats with synths, bass, pads & effects</p>
                </button>

                <button
                  onClick={() => switchTheme('rock')}
                  className={`relative bg-gradient-to-br from-red-600 to-orange-700 hover:from-red-500 hover:to-orange-600 rounded-lg p-6 transition-all duration-300 ${selectedTheme === 'rock' ? 'ring-4 ring-yellow-400' : ''}`}
                >
                  <div className="text-4xl mb-2">{themes.rock.emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{themes.rock.name}</h3>
                  <p className="text-red-100 text-sm">Rock out with guitars, bass, effects & keys</p>
                </button>

                <button
                  onClick={() => switchTheme('liminal')}
                  className={`relative bg-gradient-to-br from-cyan-600 to-purple-700 hover:from-cyan-500 hover:to-purple-600 rounded-lg p-6 transition-all duration-300 ${selectedTheme === 'liminal' ? 'ring-4 ring-yellow-400' : ''}`}
                >
                  <div className="text-4xl mb-2">{themes.liminal.emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{themes.liminal.name}</h3>
                  <p className="text-cyan-100 text-sm">Eerie ambient soundscapes with vaporwave nostalgia</p>
                </button>
              </div>
            </div>
          )}

          {showVolume && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-amber-300 font-semibold text-center flex-1">Section Volumes</h3>
                <button
                  onClick={resetVolumes}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Reset Volumes
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.keys(volumes).map(section => (
                  <div key={section} className="flex flex-col items-center">
                    <span className="text-gray-300 capitalize mb-2 font-medium">{section}</span>
                    <input
                      type="range"
                      min="-30"
                      max="0"
                      value={volumes[section]}
                      onChange={(e) => setVolumes(prev => ({ ...prev, [section]: Number(e.target.value) }))}
                      className="w-full"
                    />
                    <span className="text-gray-400 text-sm mt-1">{volumes[section]} dB</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-center text-gray-400 text-sm">
            Active musicians: {Object.keys(activeSounds).length}
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-gray-400 text-xs md:text-sm">
        🎭 Mix and match different musicians to create your masterpiece 🎭
      </div>
    </div>
  );
}

export default App;
