import { useState, useEffect, useMemo } from 'react';
import { Users, Search, BookOpen, ExternalLink, ChevronRight, User, GitBranch, ArrowRight } from 'lucide-react';
import { loadBiblePeople, BiblePerson, searchPeople, getPeopleByGender, getPeopleByLetter, getFirstLetters } from '../lib/biblePeople';
import { getPerson, type FamilyRelations } from '../lib/familyTree';

export default function People() {
  const [people, setPeople] = useState<BiblePerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [selectedPerson, setSelectedPerson] = useState<BiblePerson | null>(null);
  const [familyTree, setFamilyTree] = useState<FamilyRelations | null>(null);
  const [loadingFamily, setLoadingFamily] = useState(false);

  // Load family tree when person is selected
  useEffect(() => {
    if (selectedPerson) {
      setLoadingFamily(true);
      getPerson(selectedPerson.name)
        .then(personData => {
          if (personData?.relations) {
            setFamilyTree(personData.relations);
          } else {
            setFamilyTree(null);
          }
          setLoadingFamily(false);
        })
        .catch(() => {
          setFamilyTree(null);
          setLoadingFamily(false);
        });
    } else {
      setFamilyTree(null);
    }
  }, [selectedPerson]);

  useEffect(() => {
    loadBiblePeople()
      .then(data => {
        setPeople(data.people);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get available first letters
  const letters = useMemo(() => getFirstLetters(people), [people]);

  // Filter people
  const filteredPeople = useMemo(() => {
    let result = people;
    
    if (searchQuery) {
      result = searchPeople(result, searchQuery);
    }
    
    if (selectedGender !== 'All') {
      result = getPeopleByGender(result, selectedGender);
    }
    
    if (selectedLetter !== 'All') {
      result = getPeopleByLetter(result, selectedLetter);
    }
    
    return result;
  }, [people, searchQuery, selectedGender, selectedLetter]);

  // Group by first letter for alphabetical navigation
  const groupedPeople = useMemo(() => {
    const groups: Record<string, BiblePerson[]> = {};
    for (const person of filteredPeople) {
      const letter = person.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(person);
    }
    return groups;
  }, [filteredPeople]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading people...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" />
          Biblical People
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore {people.length} people from Scripture with verse references and descriptions
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar / Filters */}
        <div className="lg:w-64 flex-shrink-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Gender Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</h3>
            <div className="flex gap-2">
              {['All', 'Male', 'Female'].map(gender => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedGender === gender
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Alphabetical Index */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Browse A-Z</h3>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedLetter('All')}
                className={`w-8 h-8 text-sm rounded font-medium transition-colors ${
                  selectedLetter === 'All'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {letters.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-8 h-8 text-sm rounded font-medium transition-colors ${
                    selectedLetter === letter
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total People</span>
                <span className="font-medium text-gray-900 dark:text-white">{people.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Men</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {people.filter(p => p.gender === 'Male').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Women</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {people.filter(p => p.gender === 'Female').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shown</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {filteredPeople.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {selectedPerson ? (
            /* Person Detail View */
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <button
                onClick={() => setSelectedPerson(null)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
              >
                ← Back to list
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center 
                              ${selectedPerson.gender === 'Female' 
                                ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' 
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedPerson.name}
                  </h2>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full 
                                 ${selectedPerson.gender === 'Female' 
                                   ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' 
                                   : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`}>
                    {selectedPerson.gender}
                  </span>
                </div>
              </div>

              {selectedPerson.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedPerson.description}
                  </p>
                </div>
              )}

              {selectedPerson.verses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key References
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerson.verses.map((verse, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded 
                                 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 
                                 text-sm"
                      >
                        <BookOpen className="w-3 h-3" />
                        {verse}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPerson.dictionaryLink && (
                <a
                  href={selectedPerson.dictionaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg 
                           bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Full Dictionary Entry
                </a>
              )}

              {/* Family Tree Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Family Tree
                </h3>
                
                {loadingFamily ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                    Loading family data...
                  </div>
                ) : familyTree ? (
                  <div className="space-y-4">
                    {/* Parents */}
                    {(familyTree.father || familyTree.mother) && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Parents
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {familyTree.father && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                              <User className="w-3 h-3" />
                              {familyTree.father} (Father)
                            </span>
                          )}
                          {familyTree.mother && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm">
                              <User className="w-3 h-3" />
                              {familyTree.mother} (Mother)
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Siblings */}
                    {familyTree.siblings.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Siblings
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {familyTree.siblings.map((sibling: string, i: number) => (
                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                              <User className="w-3 h-3" />
                              {sibling}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Spouses */}
                    {familyTree.spouses.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          {familyTree.spouses.length === 1 ? 'Spouse' : 'Spouses'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {familyTree.spouses.map((spouse: string, i: number) => (
                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm">
                              <User className="w-3 h-3" />
                              {spouse}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Children */}
                    {familyTree.children.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Children
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {familyTree.children.map((child: string, i: number) => (
                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                              <ArrowRight className="w-3 h-3" />
                              {child}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {!familyTree.father && !familyTree.mother && 
                     familyTree.siblings.length === 0 && 
                     familyTree.spouses.length === 0 && 
                     familyTree.children.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No family relationships recorded for this person.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Family data not available for this person.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* People List */
            <div className="space-y-6">
              {Object.entries(groupedPeople).map(([letter, letterPeople]) => (
                <div key={letter}>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 
                               sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 z-10">
                    {letter}
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({letterPeople.length})
                    </span>
                  </h2>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {letterPeople.map(person => (
                      <button
                        key={person.id}
                        onClick={() => setSelectedPerson(person)}
                        className="flex items-center gap-3 p-3 rounded-lg 
                                 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                                 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 
                                 transition-all text-left"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                      ${person.gender === 'Female' 
                                        ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' 
                                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {person.name}
                          </h3>
                          {person.verses.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {person.verses[0]}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {filteredPeople.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No people found matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
