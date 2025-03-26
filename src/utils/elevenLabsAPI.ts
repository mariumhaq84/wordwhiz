/**
 * ElevenLabs API utility for text-to-speech
 */
import { toast } from "sonner";

// Set this to your API key
let ELEVEN_LABS_API_KEY = '';

// Cache audio files to reduce API calls
// Using wordId as the primary cache key to ensure unique caching per word
const audioCache: Record<string, string> = {};

export const setElevenLabsAPIKey = (apiKey: string) => {
  ELEVEN_LABS_API_KEY = apiKey;
  localStorage.setItem('elevenLabsApiKey', apiKey);
  return apiKey.length > 0;
};

export const getElevenLabsAPIKey = (): string => {
  if (!ELEVEN_LABS_API_KEY) {
    ELEVEN_LABS_API_KEY = localStorage.getItem('elevenLabsApiKey') || '';
  }
  return ELEVEN_LABS_API_KEY;
};

export const checkApiKeyConfigured = (): boolean => {
  const apiKey = getElevenLabsAPIKey();
  return apiKey.length > 0;
};

export interface SpeechOptions {
  voice?: string;
  model?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  speakerBoost?: boolean;
  wordId?: string; // Used to uniquely identify each word
}

/**
 * Generate speech from text using ElevenLabs API
 */
export const generateSpeech = async (
  text: string,
  language: string,
  options: SpeechOptions = {}
): Promise<string> => {
  // Default options
  const defaultVoice = language === 'urdu' ? 'pFZP5JQG7iQjIQuC4Bku' : 'EXAVITQu4vr4xnSDxMaL'; // Lily for Urdu, Sarah for others
  const defaultModel = 'eleven_multilingual_v2';
  
  const apiKey = getElevenLabsAPIKey();
  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  // FIXED: Use wordId as the primary cache key if available
  const cacheKey = options.wordId || `${text}_${language}`;
  
  // Return cached audio if available
  if (audioCache[cacheKey]) {
    console.log(`Using cached audio for word ID: ${cacheKey}, text: "${text}"`);
    return audioCache[cacheKey];
  }

  console.log(`Generating speech with ElevenLabs for word ID: ${cacheKey}, text: "${text}" (${language})`);

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${options.voice || defaultVoice}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: options.model || defaultModel,
          voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarityBoost || 0.75,
            style: options.style || 0.0,
            use_speaker_boost: options.speakerBoost !== undefined ? options.speakerBoost : true
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Cache the audio URL with the word ID as the key
    audioCache[cacheKey] = audioUrl;
    
    return audioUrl;
  } catch (error) {
    console.error('Error generating speech:', error);
    toast.error('Error generating speech. Please check your API key and try again.');
    throw error;
  }
};

/**
 * Play audio from a URL
 */
export const playAudio = (audioUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      console.log('Audio playback completed');
      resolve();
    };
    
    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      reject(error);
    };
    
    // Start playback
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(error => {
        console.error('Audio play promise error:', error);
        reject(error);
      });
    }
  });
};

/**
 * Generate and play speech
 */
export const speakText = async (
  text: string, 
  language: string, 
  options: SpeechOptions = {}
): Promise<void> => {
  try {
    if (!checkApiKeyConfigured()) {
      // If API key not configured, show a toast with instructions
      toast.error(
        'ElevenLabs API key not configured. Please configure it in settings.',
        { 
          duration: 5000,
          action: {
            label: 'Configure',
            onClick: () => {
              const apiKey = prompt('Enter your ElevenLabs API key:');
              if (apiKey) {
                setElevenLabsAPIKey(apiKey);
                toast.success('API key configured successfully');
              }
            }
          }
        }
      );
      return Promise.reject(new Error('API key not configured'));
    }
    
    const audioUrl = await generateSpeech(text, language, options);
    return playAudio(audioUrl);
  } catch (error) {
    console.error('Error in speakText:', error);
    return Promise.reject(error);
  }
};

// Helper to safely create object URLs from potentially revoked blob URLs
export const ensureValidAudioUrl = (url: string): string => {
  if (url.startsWith('blob:')) {
    try {
      // Test if the URL is still valid by attempting to fetch it
      fetch(url, { method: 'HEAD' }).catch(() => {
        console.log('Blob URL is no longer valid:', url);
        return null;
      });
      return url;
    } catch (e) {
      console.warn('Error checking blob URL validity:', e);
      return null;
    }
  }
  return url;
};

// Function to safely play recorded audio from various formats
export const playRecordedAudio = (recordingData: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Create a new audio element
      const audio = new Audio();
      
      // Add event listeners before setting source
      audio.onended = () => {
        console.log('Recording playback completed');
        resolve();
      };
      
      audio.onerror = (error) => {
        console.error('Recording playback error:', error);
        if (recordingData.startsWith('data:')) {
          console.log('Trying fallback data URL playback method');
          const audioElement = document.createElement('audio');
          document.body.appendChild(audioElement);
          audioElement.src = recordingData;
          audioElement.onended = () => {
            document.body.removeChild(audioElement);
            resolve();
          };
          audioElement.onerror = () => {
            document.body.removeChild(audioElement);
            reject(new Error('Failed to play recording with fallback method'));
          };
          audioElement.play().catch(reject);
        } else {
          reject(error);
        }
      };
      
      // Set source based on type
      if (recordingData.startsWith('blob:')) {
        audio.src = recordingData;
      } else if (recordingData.startsWith('data:')) {
        audio.src = recordingData;
      } else {
        reject(new Error('Unsupported recording data format'));
        return;
      }
      
      // Play the audio
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        reject(error);
      });
    } catch (error) {
      console.error('Error in playRecordedAudio:', error);
      reject(error);
    }
  });
};
