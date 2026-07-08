import { useEffect, useState } from 'react';
import { getCreedsForVerse, VerseProofLink } from '../lib/creedProofs';
import { loadCreedsLibrary } from '../data/creeds/library';
import { BookOpen, ChevronRight, ArrowLeft, Calendar, FileText } from 'lucide-react';

interface CreedProofsPanelProps {
  reference: string; // OSIS format, e.g. "Eph.1.4"
}

export default function CreedProofsPanel({ reference }: CreedProofsPanelProps) {
  const [proofs, setProofs] = useState<VerseProofLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCitation, setSelectedCitation] = useState<VerseProofLink | null>(null);
  const [sectionText, setSectionText] = useState<string | null>(null);
  const [documentYear, setDocumentYear] = useState<number | null>(null);
  const [documentType, setDocumentType] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setSelectedCitation(null);
    getCreedsForVerse(reference)
      .then(setProofs)
      .finally(() => setLoading(false));
  }, [reference]);

  useEffect(() => {
    if (selectedCitation) {
      loadCreedsLibrary().then((lib) => {
        const doc = lib.documents.find((d) => d.id === selectedCitation.creedId);
        if (doc) {
          setDocumentYear(doc.year);
          setDocumentType(doc.type);
          const section = doc.sections.find((s) => s.id === selectedCitation.sectionId);
          setSectionText(section?.content || 'Content not found.');
        }
      });
    } else {
      setSectionText(null);
    }
  }, [selectedCitation]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">Loading confessional citations...</span>
      </div>
    );
  }

  if (selectedCitation && sectionText) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 animate-fade-in">
        {/* Detail Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-955/20 dark:to-purple-955/20">
          <button
            onClick={() => setSelectedCitation(null)}
            className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to citations
          </button>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            {selectedCitation.creedTitle}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {documentYear ? (documentYear < 0 ? `${Math.abs(documentYear)} BC` : `${documentYear} AD`) : 'Unknown Year'}
            </span>
            <span className="capitalize px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
              {documentType}
            </span>
          </div>
        </div>

        {/* Detail Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
            {selectedCitation.sectionTitle}
          </div>
          <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 dark:bg-gray-850/40 rounded-xl border border-gray-200 dark:border-gray-750">
            {sectionText}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 italic">
            * This section cites {reference.replace(/\./g, ' ')} under proof text #{selectedCitation.proofId}.
          </div>
        </div>
      </div>
    );
  }

  if (proofs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No confessional citations</p>
        <p className="text-xs text-gray-400 dark:text-gray-550 mt-1 max-w-[200px]">
          This verse is not cited in any historic creeds or confessions in the library.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-955/20 dark:to-purple-955/20">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Confessional Citations
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cited {proofs.length} time{proofs.length === 1 ? '' : 's'} in library
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {proofs.map((proof, i) => (
          <button
            key={i}
            onClick={() => setSelectedCitation(proof)}
            className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-305 dark:hover:border-indigo-850/60 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all flex items-center justify-between group"
          >
            <div className="flex-1 min-w-0 pr-2">
              <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {proof.creedTitle}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {proof.sectionTitle}
              </div>
              <div className="inline-block text-[10px] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded mt-1.5">
                Proof #{proof.proofId}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
