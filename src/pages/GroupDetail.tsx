import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getReadingProgress } from '../lib/firestore';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  PenTool, 
  Heart, 
  CheckCircle, 
  Send, 
  Plus, 
  ChevronLeft,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { getDayReading } from '../data/biblicalEras';
import { getSharedEcclesialResponses, addAmenToResponse, EcclesialResponse } from '../data/callAndResponseData';
import type { Group, JournalEntry, Prayer } from '../types';

interface GroupComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState<'progress' | 'discussions' | 'journal' | 'prayers' | 'ecclesial'>('ecclesial');
  const [userProgressDays, setUserProgressDays] = useState<number>(0);
  const [ecclesialResponses, setEcclesialResponses] = useState<EcclesialResponse[]>([]);
  
  // Discussion state
  const [comments, setComments] = useState<GroupComment[]>([]);
  const [newComment, setNewComment] = useState('');
  
  // Shared Journal state
  const [sharedJournals, setSharedJournals] = useState<JournalEntry[]>([]);
  
  // Shared Prayers state
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayer, setNewPrayer] = useState('');

  // Daily discussion prompt helper
  const currentDay = Math.min(Math.max(1, userProgressDays + 1), 502);
  const dayReading = getDayReading(currentDay);

  useEffect(() => {
    // Load Ecclesial Responses
    setEcclesialResponses(getSharedEcclesialResponses());

    // 1. Load Group Details
    const storedGroups = localStorage.getItem('scriptorium_groups');
    if (storedGroups) {
      const groups: Group[] = JSON.parse(storedGroups);
      const found = groups.find(g => g.id === id);
      if (found) {
        setGroup(found);
      } else {
        // Fallback mock group if created externally
        setGroup({
          id: id || '',
          name: 'Community Reading Circle',
          description: 'A study circle dedicated to reading the scriptures chronologically and encouraging one another daily.',
          memberCount: 5,
          createdAt: new Date().toISOString(),
          createdBy: 'system'
        });
      }
    }

    // 2. Load User Progress
    if (user?.id) {
      getReadingProgress(user.id, 'chronological').then(progress => {
        const completedCount = Object.values(progress).filter(p => p.completed).length;
        setUserProgressDays(completedCount);
      });
    }

    // 3. Load Comments from LocalStorage
    const storedComments = localStorage.getItem(`scriptorium_group_comments_${id}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      // Default mock comments
      const mockComments: GroupComment[] = [
        { id: '1', authorName: 'Pastor Timothy', content: "Today's reading reminds us that God's timing is perfect. Even when we feel in exile, He is orchestrating our return.", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: '2', authorName: 'Sarah S.', content: 'Amen! It is so comforting to go through this plan together with you all.', createdAt: new Date(Date.now() - 3600000).toISOString() }
      ];
      setComments(mockComments);
      localStorage.setItem(`scriptorium_group_comments_${id}`, JSON.stringify(mockComments));
    }

    // 4. Load Shared Journals
    const storedJournals = localStorage.getItem('scriptorium_journal');
    if (storedJournals) {
      const journals: JournalEntry[] = JSON.parse(storedJournals);
      // Filter journals marked as shared or tagged with the group id
      const shared = journals.filter(j => j.tags.includes('shared') || j.tags.includes(id || ''));
      setSharedJournals(shared);
    }

    // 5. Load Group Prayers
    const storedPrayers = localStorage.getItem(`scriptorium_group_prayers_${id}`);
    if (storedPrayers) {
      setPrayers(JSON.parse(storedPrayers));
    } else {
      const mockPrayers: Prayer[] = [
        { id: 'p1', content: "Healing for Mary Jo's sister recovering from knee surgery.", isAnswered: false, createdAt: new Date(Date.now() - 86400000).toISOString(), userId: 'maryjo' },
        { id: 'p2', content: "Wisdom and safety for the youth retreat next week.", isAnswered: true, createdAt: new Date(Date.now() - 172800000).toISOString(), answeredAt: new Date().toISOString(), userId: 'pastortim' }
      ];
      setPrayers(mockPrayers);
      localStorage.setItem(`scriptorium_group_prayers_${id}`, JSON.stringify(mockPrayers));
    }
  }, [id, user?.id]);

  // Handle Comment Submit
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: GroupComment = {
      id: crypto.randomUUID(),
      authorName: user?.name || 'You',
      content: newComment,
      createdAt: new Date().toISOString()
    };

    const updated = [...comments, newCommentObj];
    setComments(updated);
    localStorage.setItem(`scriptorium_group_comments_${id}`, JSON.stringify(updated));
    setNewComment('');
  };

  // Handle Prayer Submit
  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    const newPrayerObj: Prayer = {
      id: crypto.randomUUID(),
      content: newPrayer,
      isAnswered: false,
      createdAt: new Date().toISOString(),
      userId: user?.id || 'anonymous'
    };

    const updated = [newPrayerObj, ...prayers];
    setPrayers(updated);
    localStorage.setItem(`scriptorium_group_prayers_${id}`, JSON.stringify(updated));
    setNewPrayer('');
  };

  // Toggle Prayer Answered
  const togglePrayerAnswered = (prayerId: string) => {
    const updated = prayers.map(p => {
      if (p.id === prayerId) {
        return {
          ...p,
          isAnswered: !p.isAnswered,
          answeredAt: !p.isAnswered ? new Date().toISOString() : undefined
        };
      }
      return p;
    });
    setPrayers(updated);
    localStorage.setItem(`scriptorium_group_prayers_${id}`, JSON.stringify(updated));
  };

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate Roster Progress
  const members = [
    { name: 'Pastor Timothy', completed: 362, avatar: '👴', color: 'text-blue-500' },
    { name: 'Dr. Bradley', completed: 472, avatar: '👨‍⚕️', color: 'text-emerald-500' },
    { name: 'You', completed: userProgressDays, avatar: '🙋‍♂️', color: 'text-indigo-500' },
    { name: 'Mary Jo', completed: 241, avatar: '👵', color: 'text-purple-500' },
    { name: 'Sarah S.', completed: 150, avatar: '👩', color: 'text-pink-500' }
  ].sort((a, b) => b.completed - a.completed);

  const groupAveragePercent = Math.round(
    (members.reduce((acc, m) => acc + m.completed, 0) / (members.length * 502)) * 100
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/groups')}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Groups
      </button>

      {/* Group Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{group.name}</h1>
            </div>
            <p className="text-orange-50 max-w-2xl text-sm sm:text-base leading-relaxed">
              {group.description}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center self-start md:self-auto min-w-[120px]">
            <p className="text-3xl font-bold">{groupAveragePercent}%</p>
            <p className="text-xs text-orange-100 uppercase tracking-wider font-semibold mt-1">Group Progress</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('ecclesial')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'ecclesial'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-55 dark:hover:bg-gray-700/50'
          }`}
        >
          <Users className="w-4 h-4 text-amber-300" />
          <span>Ecclesial Responses</span>
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'progress'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-55 dark:hover:bg-gray-700/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Progress</span>
        </button>
        <button
          onClick={() => setActiveTab('discussions')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'discussions'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-55 dark:hover:bg-gray-700/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Discussions</span>
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'journal'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-55 dark:hover:bg-gray-700/50'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Shared Journals</span>
        </button>
        <button
          onClick={() => setActiveTab('prayers')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'prayers'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-55 dark:hover:bg-gray-700/50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Prayer Wall</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-200">
        
        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Member Progress Roster
            </h3>
            <div className="space-y-4">
              {members.map((member, idx) => {
                const percent = Math.round((member.completed / 502) * 100);
                const isUser = member.name === 'You';
                return (
                  <div key={idx} className={`p-4 rounded-xl border transition-all ${isUser ? 'bg-orange-50/50 dark:bg-orange-950/15 border-orange-200 dark:border-orange-900/40 shadow-sm' : 'bg-gray-50/30 dark:bg-gray-900/10 border-gray-150 dark:border-gray-750'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{member.avatar}</span>
                        <span className={`font-semibold ${isUser ? 'text-orange-700 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                          {member.name} {isUser && <span className="text-xs font-normal text-gray-400 ml-1">(Author)</span>}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-750 dark:text-gray-300">
                        {member.completed}/502 days ({percent}%)
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isUser ? 'bg-orange-500' : 'bg-amber-500'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DISCUSSIONS TAB */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            {/* Daily Prompt Banner */}
            {dayReading && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold text-sm">Day {currentDay} Reading Prompt</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{dayReading.title}</h4>
                <p className="text-gray-750 dark:text-gray-300 italic text-sm border-l-2 border-amber-300 dark:border-amber-800 pl-3">
                  "{dayReading.discussionPrompt}"
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                Comments
              </h3>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center font-bold text-orange-700 dark:text-orange-400">
                      {comment.authorName[0]}
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-800 p-3 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">{comment.authorName}</span>
                        <span className="text-[10px] text-gray-400">
                          {format(new Date(comment.createdAt), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on today's reading..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SHARED JOURNAL TAB */}
        {activeTab === 'journal' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-orange-500" />
                Shared Journals Feed
              </h3>
              <Link
                to={`/journal/new?groupId=${id}`}
                className="flex items-center gap-1 text-xs text-orange-650 dark:text-orange-400 font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Share reflection
              </Link>
            </div>

            {sharedJournals.length > 0 ? (
              <div className="space-y-4">
                {sharedJournals.map((journal) => (
                  <div key={journal.id} className="p-4 border border-gray-150 dark:border-gray-705 rounded-xl bg-gray-50/20 dark:bg-gray-900/10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{journal.title}</h4>
                        {journal.passage && (
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5 inline-block">
                            📖 {journal.passage}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {format(new Date(journal.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-650 dark:text-gray-350 line-clamp-3 whitespace-pre-line leading-relaxed">
                      {journal.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 italic text-sm">
                No reflections shared with the circle yet. Tick the 'Share with Group' option when writing your journal entries.
              </div>
            )}
          </div>
        )}

        {/* PRAYER WALL TAB */}
        {activeTab === 'prayers' && (
          <div className="space-y-6">
            {/* Add Prayer Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-500" />
                Post a Prayer Request
              </h3>
              <form onSubmit={handleAddPrayer} className="flex gap-2">
                <input
                  type="text"
                  value={newPrayer}
                  onChange={(e) => setNewPrayer(e.target.value)}
                  placeholder="How can we pray for you today?"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Post
                </button>
              </form>
            </div>

            {/* Prayers List */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">Shared Prayer Requests</h4>
              <div className="space-y-3">
                {prayers.map((prayer) => (
                  <div key={prayer.id} className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${prayer.isAnswered ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40 opacity-80' : 'bg-gray-50/50 dark:bg-gray-900/20 border-gray-150 dark:border-gray-750'}`}>
                    <div className="space-y-1">
                      <p className={`text-sm ${prayer.isAnswered ? 'line-through text-gray-550 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200 font-medium'}`}>
                        {prayer.content}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span>Posted {format(new Date(prayer.createdAt), 'MMM d')}</span>
                        {prayer.isAnswered && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/50 px-1 py-0.25 rounded">
                            ANSWERED!
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => togglePrayerAnswered(prayer.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        prayer.isAnswered 
                          ? 'bg-emerald-550 border-emerald-600 text-white dark:bg-emerald-600' 
                          : 'border-gray-300 dark:border-gray-650 hover:bg-gray-150 dark:hover:bg-gray-700 text-gray-450 dark:text-gray-400'
                      }`}
                      title={prayer.isAnswered ? "Mark unanswered" : "Mark as answered!"}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ECCLESIAL RESPONSES (GROUP DISCIPLESHIP SHARING) */}
        {activeTab === 'ecclesial' && (
          <div className="space-y-6 animate-fade-in">
            {/* Hebrews 10:24-25 Encouragement Callout */}
            <div className="bg-gradient-to-r from-amber-900/40 via-amber-950/60 to-slate-900 border border-amber-500/30 rounded-2xl p-5 text-amber-100 shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-amber-200">
                    Covenant Community Discipleship Feed (Hebrews 10:24-25)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed italic font-serif">
                    "And let us consider how to stir up one another to love and good works, not neglecting to meet together... but encouraging one another, and all the more as you see the Day drawing near."
                  </p>
                  <p className="text-[11px] text-amber-300/80 pt-1 font-sans">
                    Members of your study group share their reflective entries, guided prayers, and logged acts of obedience as they journey through redemptive history together.
                  </p>
                </div>
              </div>
            </div>

            {/* Ecclesial Discipleship Cards */}
            <div className="space-y-4">
              {ecclesialResponses.map((item) => {
                const hasAmened = item.userAmens?.includes('current-user');

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:border-amber-500/40"
                  >
                    {/* Item Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-amber-600 dark:text-amber-300 text-xs">
                          {item.authorName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                            {item.authorName}
                          </h4>
                          <span className="text-[10px] text-gray-400">
                            {format(new Date(item.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Epoch Badge */}
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          {item.epochTitle}
                        </span>

                        {/* Response Type Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.responseType === 'reflection'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : item.responseType === 'prayer'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {item.responseType}
                        </span>
                      </div>
                    </div>

                    {/* Prompt Text */}
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 italic">
                      "{item.promptText}"
                    </p>

                    {/* Response Text Content */}
                    <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-150 dark:border-gray-750">
                      <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {item.responseText}
                      </p>
                    </div>

                    {/* Amen Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-gray-400">
                        Stirring up love and good works
                      </span>
                      <button
                        onClick={() => {
                          const updated = addAmenToResponse(item.id, 'current-user');
                          setEcclesialResponses(updated);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          hasAmened
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasAmened ? 'fill-current' : ''}`} />
                        <span>Amen! ({item.amenCount})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
