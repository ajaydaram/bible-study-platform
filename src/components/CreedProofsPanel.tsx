import { useEffect, useState } from 'react';
import { getCreedsForVerse, VerseProofLink } from '../lib/creedProofs';
import { BookOpen } from 'lucide-react';

interface CreedProofsPanelProps {
  reference: string; // OSIS format, e.g. "Eph.1.4"
}

export default function CreedProofsPanel({ reference }: CreedProofsPanelProps) {
  const [proofs, setProofs] = useState<VerseProofLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCreedsForVerse(reference)
      .then(setProofs)
      .finally(() => setLoading(false));
  }, [reference]);

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading confessional links...</div>;
  }

  if (proofs.length === 0) {
    return <div className="text-gray-400 text-sm">No confessional citations for this verse.</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        <span className="font-semibold text-gray-900 dark:text-white text-sm">Confessional Citations</span>
      </div>
      <ul className="space-y-2">
        {proofs.map((proof, i) => (
          <li key={i} className="text-sm">
            <span className="font-medium text-indigo-700 dark:text-indigo-300">
              {proof.creedTitle}
            </span>
            {': '}
            <span className="text-gray-700 dark:text-gray-200">
              Section {proof.sectionId} ({proof.sectionTitle})
            </span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">Proof #{proof.proofId}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
