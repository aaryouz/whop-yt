'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

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

  const downloadAsExcel = () => {
    if (!result) return;

    try {
      // Prepare data for Excel with two columns: Shorts Link and Transcript
      const excelData = result.shorts.map((short) => ({
        'Shorts Link': short.url,
        'Transcript': short.transcript || 'No transcript available'
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'YouTube Shorts Transcripts');

      // Trigger download
      XLSX.writeFile(workbook, `youtube-shorts-transcripts-${Date.now()}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      alert('Failed to generate Excel file. Please try again.');
    }
  };

  const copyTranscript = (transcript: string) => {
    navigator.clipboard.writeText(transcript);
    alert('Transcript copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-8">
      <div className="w-full max-w-6xl mx-auto p-6">
        {process.env.NODE_ENV === 'production' && (
          <div className="mb-6 p-4 bg-[#1A1A1A] border border-[#FF6B35] rounded-lg text-[#FF6B35]">
            <strong>⚠️ Warning:</strong> This is a test page and should not be publicly accessible in production.
            Please access the app through the proper Whop experience view.
          </div>
        )}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">YouTube Shorts Transcript Extractor</h1>
          <p className="text-[#A0A0A0]">
            Extract transcripts from the most viral shorts from any YouTube channel
          </p>
          <p className="text-sm text-[#4F6AFF] mt-2">
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
              className="flex-1 px-4 py-3 bg-[#141414] border border-[#2A2A2A] text-white placeholder-[#6B6B6B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6AFF] focus:border-[#4F6AFF] transition-colors"
              disabled={loading}
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#A0A0A0]">
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
                        ? 'border-[#4F6AFF] bg-[#4F6AFF]/10 text-[#4F6AFF]'
                        : 'border-[#2A2A2A] bg-[#141414] text-[#A0A0A0] hover:border-[#4F6AFF]/50 hover:text-white'
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
                  className="px-4 py-2 w-32 border-2 border-[#2A2A2A] bg-[#141414] text-white placeholder-[#6B6B6B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6AFF] focus:border-[#4F6AFF] transition-colors"
                  disabled={loading}
                />
              </div>

              <p className="text-xs text-[#6B6B6B]">
                💡 Selected: <span className="font-medium text-[#A0A0A0]">{limit} shorts</span>
                {limit >= 50 && <span className="text-[#FF6B35] ml-2">⚠️ Higher limits consume more API credits and take longer</span>}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !channelUrl || limit < 1 || limit > 100}
              className="px-8 py-3 bg-[#4F6AFF] text-white rounded-lg hover:bg-[#3D56E5] disabled:bg-[#2A2A2A] disabled:text-[#6B6B6B] disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? `Extracting top ${limit}...` : `Extract Top ${limit} Shorts`}
            </button>
          </div>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Example: https://youtube.com/@mrbeast or https://youtube.com/@mkbhd
          </p>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-[#1A1A1A] border border-[#FF6B35] rounded-lg text-[#FF6B35]">
            <div className="font-bold mb-2">❌ Error:</div>
            <div className="mb-2">{error.error}</div>
            {error.debug && (
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-medium">🔍 Debug Info (click to expand)</summary>
                <pre className="mt-2 p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded overflow-x-auto">
                  {error.debug}
                </pre>
              </details>
            )}
            {error.details && (
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-medium">📋 Technical Details</summary>
                <pre className="mt-2 p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded overflow-x-auto text-xs">
                  {error.details}
                </pre>
              </details>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F6AFF]"></div>
            <p className="mt-4 text-[#A0A0A0]">
              Fetching top {limit} shorts and extracting transcripts... This may take 1-2 minutes.
            </p>
          </div>
        )}

        {result && (
          <div>
            <div className="mb-6 p-4 bg-[#1A1A1A] border border-[#10B981] rounded-lg">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <p className="text-[#10B981] font-medium">
                    ✅ Successfully extracted {result.shorts.length} shorts (top {limit} requested) from {result.totalShorts} total shorts
                  </p>
                  <p className="text-[#A0A0A0] text-sm mt-1">Channel ID: {result.channelId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={downloadTranscripts}
                    className="px-4 py-2 bg-[#222222] text-white rounded-lg hover:bg-[#2A2A2A] border border-[#2A2A2A] font-medium text-sm transition-colors"
                  >
                    Download JSON
                  </button>
                  <button
                    onClick={downloadAsExcel}
                    className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#0EA472] font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    <span>📊</span>
                    <span>Download Excel</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {result.shorts.map((short, index) => (
                <div
                  key={short.id}
                  className="border border-[#2A2A2A] rounded-lg p-6 hover:border-[#4F6AFF]/50 transition-all bg-[#141414]"
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
                          <span className="inline-block px-3 py-1 bg-[#4F6AFF]/10 text-[#4F6AFF] border border-[#4F6AFF]/20 rounded-full text-sm font-medium mb-2">
                            #{index + 1}
                          </span>
                          <h3 className="text-xl font-semibold mb-1 text-white">{short.title}</h3>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-[#A0A0A0] mb-3">
                        <span>👁️ {short.viewCount.toLocaleString()} views</span>
                        <span>•</span>
                        <span>📅 {new Date(short.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <a
                        href={short.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4F6AFF] hover:text-[#6B82FF] hover:underline text-sm mb-3 inline-block transition-colors"
                      >
                        Watch on YouTube →
                      </a>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">Transcript:</h4>
                          <button
                            onClick={() => copyTranscript(short.transcript || '')}
                            className="px-3 py-1 text-sm bg-[#222222] hover:bg-[#2A2A2A] text-white border border-[#2A2A2A] rounded transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg max-h-48 overflow-y-auto">
                          <p className="text-sm text-[#A0A0A0] whitespace-pre-wrap">
                            {short.transcript && !short.transcript.includes('not available') && !short.transcript.includes('disabled')
                              ? short.transcript
                              : (
                                <span className="text-[#6B6B6B] italic">
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
