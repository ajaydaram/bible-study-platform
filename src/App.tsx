import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { SearchProvider } from './contexts/SearchContext'
import { AccessibilityProvider } from './contexts/AccessibilityContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layouts/DashboardLayout'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { SkipLink } from './components/AccessibilitySettings'

// Auth pages
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'

// Main pages
import Dashboard from './pages/Dashboard'
import Bible from './pages/Bible'
import ChronologicalPath from './pages/paths/ChronologicalPath'
import ThematicPath from './pages/paths/ThematicPath'
import Journal from './pages/Journal'
import JournalNew from './pages/JournalNew'
import JournalEdit from './pages/JournalEdit'
import Groups from './pages/Groups'
import GroupNew from './pages/GroupNew'
import Discussions from './pages/Discussions'
import DiscussionNew from './pages/DiscussionNew'
import Prayers from './pages/Prayers'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Resources from './pages/Resources'
import CrossReferences from './pages/CrossReferences'
import BibleDictionary from './pages/BibleDictionary'
import BibleMaps from './pages/BibleMaps'
import Achievements from './pages/Achievements'

// Pulse - Theological Diagnostics
import PulseHub from './pages/PulseHub'
import PulseSection from './pages/PulseSection'
import Pulse from './pages/Pulse'
import PulseResults from './pages/PulseResults'

// Sermon Prep
import SermonHub from './pages/SermonHub'
import SermonNew from './pages/SermonNew'
import SermonEdit from './pages/SermonEdit'

// Word Study & Interlinear
import WordStudyPage from './pages/WordStudyPage'
import InterlinearPage from './pages/resources/InterlinearPage'

// Church History
import ChurchHistory from './pages/ChurchHistory'

// New Features: Timeline, Hymnal, People
import Timeline from './pages/Timeline'
import Hymnal from './pages/Hymnal'
import People from './pages/People'

// Discipleship & Teaching
import DiscipleshipStudy from './pages/DiscipleshipStudy'

// Shared Content
import SharedNote from './pages/SharedNote'

// Reading Plans
import ReadingPlans from './pages/ReadingPlans'
import ReadingPlanNew from './pages/ReadingPlanNew'

function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <ThemeProvider>
          <AuthProvider>
            <SearchProvider>
              <SkipLink />
              <Routes>
                {/* Public routes */}
                <Route path="/auth/signin" element={<SignIn />} />
                <Route path="/auth/signup" element={<SignUp />} />
                <Route path="/shared/:shareId" element={<SharedNote />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/bible" element={<Bible />} />
                    <Route path="/paths/chronological" element={<ChronologicalPath />} />
                    <Route path="/paths/thematic" element={<ThematicPath />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/journal/new" element={<JournalNew />} />
                    <Route path="/journal/edit/:id" element={<JournalEdit />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/groups/new" element={<GroupNew />} />
                    <Route path="/discussions" element={<Discussions />} />
                    <Route path="/discussions/new" element={<DiscussionNew />} />
                    <Route path="/prayers" element={<Prayers />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/resources/cross-references" element={<CrossReferences />} />
                    <Route path="/resources/dictionary" element={<BibleDictionary />} />
                    <Route path="/resources/maps" element={<BibleMaps />} />
                    <Route path="/pulse" element={<PulseHub />} />
                    <Route path="/pulse/section/:sectionId" element={<PulseSection />} />
                    <Route path="/pulse/full" element={<Pulse />} />
                    <Route path="/pulse/results" element={<PulseResults />} />
                    <Route path="/sermons" element={<SermonHub />} />
                    <Route path="/sermons/new" element={<SermonNew />} />
                    <Route path="/sermons/edit/:id" element={<SermonEdit />} />
                    <Route path="/word-study" element={<WordStudyPage />} />
                    <Route path="/resources/word-study" element={<WordStudyPage />} />
                    <Route path="/resources/interlinear" element={<InterlinearPage />} />
                    <Route path="/resources/church-history" element={<ChurchHistory />} />
                    <Route path="/resources/timeline" element={<Timeline />} />
                    <Route path="/resources/hymnal" element={<Hymnal />} />
                    <Route path="/resources/people" element={<People />} />
                    <Route path="/resources/discipleship" element={<DiscipleshipStudy />} />
                    <Route path="/reading-plans" element={<ReadingPlans />} />
                    <Route path="/reading-plans/new" element={<ReadingPlanNew />} />
                  </Route>
                </Route>
              </Routes>
            </SearchProvider>
          </AuthProvider>
        </ThemeProvider>
        <PWAInstallPrompt />
      </AccessibilityProvider>
    </BrowserRouter>
  )
}

export default App
