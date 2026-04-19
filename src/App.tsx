import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LearnPage from './pages/LearnPage';
import { LoginPage, RegisterPage, InstructorApplyPage } from './pages/AuthPages';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AboutPage, PricingPage, ContactPage } from './pages/PublicPages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth - no layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Learn page - no layout */}
        <Route path="/learn/:courseId" element={<LearnPage />} />

        {/* Dashboards - no layout (have their own) */}
        <Route path="/dashboard/*" element={<StudentDashboard />} />
        <Route path="/instructor/*" element={<InstructorDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Public pages with layout */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
        <Route path="/courses/:slug" element={<Layout><CourseDetailPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/become-instructor" element={<Layout><InstructorApplyPage /></Layout>} />
        <Route path="/profile" element={<Layout><div className="p-8 text-center">Profile page</div></Layout>} />
        <Route path="/forgot-password" element={<Layout><div className="p-8 text-center">Password reset coming soon</div></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
