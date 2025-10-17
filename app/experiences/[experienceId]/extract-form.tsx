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

export default function ExtractForm() {
  const [channelUrl, setChannelUrl] = useState('');
  const [limit, setLimit] = useState<number>(25);
  const [customLimit, setCustomLimit] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(data.error || 'Failed to extract shorts');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-[var(--text-primary)]">YouTube Shorts Transcript Extractor</h1>
        <p className="text-[var(--text-secondary)]">
          Extract transcripts from the most viral shorts from any YouTube channel
        </p>
        <div className="mt-4 p-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
          <strong className="text-[var(--brand-light)]">ℹ️ About Transcripts:</strong> Transcript availability depends on creator settings.
          Most channels have 80-100% success rate, but some creators disable captions on their Shorts.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={channelUrl}
            onChange={(e) => setChannelUrl(e.target.value)}
            placeholder="Enter YouTube channel URL (e.g., https://youtube.com/@channelname)"
            className="flex-1 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            disabled={loading}
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-[var(--text-primary)]">
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
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-light)]'
                      : 'border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--brand-primary)]'
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
                className="px-4 py-2 w-32 bg-[var(--bg-tertiary)] border-2 border-[var(--border-default)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-[var(--border-focus)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                disabled={loading}
              />
            </div>

            <p className="text-xs text-[var(--text-tertiary)]">
              💡 Selected: <span className="font-medium text-[var(--text-primary)]">{limit} shorts</span>
              {limit >= 50 && <span className="text-[var(--accent-orange)] ml-2">⚠️ Higher limits consume more API credits and take longer</span>}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !channelUrl || limit < 1 || limit > 100}
            className="px-8 py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-hover)] disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? `Extracting top ${limit}...` : `Extract Top ${limit} Shorts`}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
          <p className="mt-4 text-[var(--text-secondary)]">
            Fetching top {limit} shorts and extracting transcripts... This may take a minute.
          </p>
        </div>
      )}

      {result && (
        <div>
          <div className="mb-6 p-4 bg-[var(--accent-emerald)]/10 border border-[var(--accent-emerald)]/30 rounded-lg">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <p className="text-[var(--accent-emerald)] font-medium">
                  Successfully extracted {result.shorts.length} shorts (top {limit} requested) from {result.totalShorts} total shorts
                </p>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Channel ID: {result.channelId}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadTranscripts}
                  className="px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] font-medium text-sm transition-colors"
                >
                  Download JSON
                </button>
                <button
                  onClick={downloadAsExcel}
                  className="px-4 py-2 bg-[var(--accent-emerald)] text-white rounded-lg hover:bg-[var(--accent-emerald)]/80 font-medium text-sm flex items-center gap-1 transition-colors"
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
                className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-6 hover:border-[var(--border-focus)]/50 transition-all"
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
                      <div>
                        <span className="inline-block px-3 py-1 bg-[var(--brand-primary)]/10 text-[var(--brand-light)] rounded-full text-sm font-medium mb-2">
                          #{index + 1}
                        </span>
                        <h3 className="text-xl font-semibold mb-1 text-[var(--text-primary)]">{short.title}</h3>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-[var(--text-secondary)] mb-3">
                      <span>{short.viewCount.toLocaleString()} views</span>
                      <span>•</span>
                      <span>{new Date(short.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <a
                      href={short.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--brand-primary)] hover:text-[var(--brand-light)] hover:underline text-sm mb-3 inline-block transition-colors"
                    >
                      Watch on YouTube →
                    </a>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[var(--text-primary)]">Transcript:</h4>
                        <button
                          onClick={() => copyTranscript(short.transcript || '')}
                          className="px-3 py-1 text-sm bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg max-h-48 overflow-y-auto">
                        <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
                          {short.transcript && !short.transcript.includes('not available') && !short.transcript.includes('disabled')
                            ? short.transcript
                            : (
                              <span className="text-[var(--text-tertiary)] italic">
                                {short.transcript || 'No transcript available'}
                                <br/><br/>
                                <span className="text-xs">
                                  💡 This creator has disabled transcripts/captions for this Short.
                                  This is a YouTube platform setting controlled by the creator.
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
  );
}
