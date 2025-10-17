'use client';

import { useState } from 'react';

interface ShortVideo {
  id: string;
  title: string;
  viewCount: number;
  publishedAt: string;
  thumbnail: string;
  url: string;
  transcript?: string;
}

interface ExtractResult {
  success: boolean;
  channelId: string;
  totalShorts: number;
  shorts: ShortVideo[];
}

interface ErrorResponse {
  error: string;
  debug?: string;
  details?: string;
}

export default function TestPage() {
  const [channelUrl, setChannelUrl] = useState('');
  const [limit, setLimit] = useState<number>(25);
  const [customLimit, setCustomLimit] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/extract-shorts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelUrl, limit }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({
          error: data.error || 'Failed to extract shorts',
          debug: data.debug,
          details: data.details
        });
        return;
      }

      setResult(data);
    } catch (err) {
      setError({
        error: err instanceof Error ? err.message : 'An error occurred',
        debug: err instanceof Error ? err.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTranscripts = () => {
    if (!result) return;

    const transcriptData = result.shorts.map((short, index) => ({
      rank: index + 1,
      title: short.title,
      views: short.viewCount.toLocaleString(),
      url: short.url,
      publishedAt: new Date(short.publishedAt).toLocaleDateString(),
      transcript: short.transcript || 'No transcript available',
    }));

    const jsonStr = JSON.stringify(transcriptData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `youtube-shorts-transcripts-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyTranscript = (transcript: string) => {
    navigator.clipboard.writeText(transcript);
    alert('Transcript copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-6xl mx-auto p-6">
        {process.env.NODE_ENV === 'production' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-400 rounded-lg text-yellow-800">
            <strong>⚠️ Warning:</strong> This is a test page and should not be publicly accessible in production.
            Please access the app through the proper Whop experience view.
          </div>
        )}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">YouTube Shorts Transcript Extractor</h1>
          <p className="text-gray-600">
            Extract transcripts from the most viral shorts from any YouTube channel
          </p>
          <p className="text-sm text-blue-600 mt-2">
            🧪 Test Mode - No authentication required
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="Enter YouTube channel URL (e.g., https://youtube.com/@mrbeast)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                How many top shorts do you want to extract?
              </label>

              {/* Quick select buttons */}
              <div className="flex flex-wrap gap-2">
                {[5, 10, 25, 50, 100].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setLimit(value);
                      setCustomLimit('');
                    }}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                      limit === value && customLimit === ''
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                    }`}
                    disabled={loading}
                  >
                    {value}
                  </button>
                ))}

                {/* Custom input */}
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customLimit}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomLimit(value);
                    const num = parseInt(value);
                    if (value && !isNaN(num) && num >= 1 && num <= 100) {
                      setLimit(num);
                    }
                  }}
                  placeholder="Custom (1-100)"
                  className="px-4 py-2 w-32 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <p className="text-xs text-gray-500">
                💡 Selected: <span className="font-medium text-gray-700">{limit} shorts</span>
                {limit >= 50 && <span className="text-orange-600 ml-2">⚠️ Higher limits consume more API credits and take longer</span>}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !channelUrl || limit < 1 || limit > 100}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? `Extracting top ${limit}...` : `Extract Top ${limit} Shorts`}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Example: https://youtube.com/@mrbeast or https://youtube.com/@mkbhd
          </p>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="font-bold mb-2">❌ Error:</div>
            <div className="mb-2">{error.error}</div>
            {error.debug && (
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-medium">🔍 Debug Info (click to expand)</summary>
                <pre className="mt-2 p-3 bg-red-100 rounded overflow-x-auto">
                  {error.debug}
                </pre>
              </details>
            )}
            {error.details && (
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-medium">📋 Technical Details</summary>
                <pre className="mt-2 p-3 bg-red-100 rounded overflow-x-auto text-xs">
                  {error.details}
                </pre>
              </details>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">
              Fetching top {limit} shorts and extracting transcripts... This may take 1-2 minutes.
            </p>
          </div>
        )}

        {result && (
          <div>
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-800 font-medium">
                    ✅ Successfully extracted {result.shorts.length} shorts (top {limit} requested) from {result.totalShorts} total shorts
                  </p>
                  <p className="text-green-600 text-sm mt-1">Channel ID: {result.channelId}</p>
                </div>
                <button
                  onClick={downloadTranscripts}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Download All
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {result.shorts.map((short, index) => (
                <div
                  key={short.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={short.thumbnail}
                        alt={short.title}
                        className="w-40 h-auto rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                            #{index + 1}
                          </span>
                          <h3 className="text-xl font-semibold mb-1">{short.title}</h3>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 mb-3">
                        <span>👁️ {short.viewCount.toLocaleString()} views</span>
                        <span>•</span>
                        <span>📅 {new Date(short.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <a
                        href={short.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mb-3 inline-block"
                      >
                        Watch on YouTube →
                      </a>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Transcript:</h4>
                          <button
                            onClick={() => copyTranscript(short.transcript || '')}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {short.transcript && !short.transcript.includes('not available') && !short.transcript.includes('disabled')
                              ? short.transcript
                              : (
                                <span className="text-gray-500 italic">
                                  {short.transcript || 'No transcript available'}
                                  <br/><br/>
                                  <span className="text-xs">
                                    💡 Many YouTube Shorts creators disable transcripts/captions. This is a YouTube platform setting controlled by the creator.
                                  </span>
                                </span>
                              )
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
