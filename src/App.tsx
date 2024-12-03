import React, { Suspense } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import 'react-calendar/dist/Calendar.css';

import { userStore } from './store/userStore';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Auth from './pages/Auth/Auth';
import Sessions from './pages/Sessions';
import ReferAndEarn from './pages/ReferAndEarn';
import BookSession from './pages/BookSession';
import PageNotFound from './pages/PageNotFound';
import ForgetPassword from './pages/Auth/ForgetPassword';
import QuestionSlider from './components/Slider';
import VerifyMail from './pages/VerifyMail';
import OnBoarding from './pages/Auth/OnBoarding';
import Faq from './pages/Faq';
import InterviewByAI from './pages/InterviewByAI';
import DefaultLayout from './layout/DefaultLayout';
import UpdateEmailPage from './pages/Auth/UpdateEmailPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f7941f',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

const LazyProfilePage = React.lazy(() => import('./pages/Profile'));
const LazyDisputePage = React.lazy(() => import('./pages/Dispute'));
const LazySubscribePage = React.lazy(() => import('./pages/Subscribe'));
const LazyLessonPlanPage = React.lazy(() => import('./pages/lessonPlan'));
const LazyUserFeedbackReportPagePage = React.lazy(() => import('./pages/UserFeedbackReportPage'));
const LazyAiServicesPage = React.lazy(() => import('./pages/AiServices'));
const CallToTutor = React.lazy(() => import('./pages/CallToTutor'));
const CallScreen = React.lazy(() => import('./pages/CallToTutor/CallScreen'));

const App: React.FC = () => {
  const isFetching = userStore((state) => state.isFetching);
  const location = useLocation();
  const shouldShowHeader = !location.pathname.startsWith('/session/');

  return (
    <div className="app">
      {isFetching && <SplashScreen />}
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            element={
              <div>
                {shouldShowHeader && <Header />}
                <Outlet />
                {/* <Copyright /> */}
              </div>
            }
          >
            <Route
              path="/"
              element={
                <DefaultLayout>
                  <Home />
                </DefaultLayout>
              }
            />
            <Route path="/book-session" element={<BookSession />} />
            <Route path="/book-demo-session" element={<BookSession />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/refer-and-earn" element={<ReferAndEarn />} />
            <Route path="/ai-services">
              <Route
                path="/ai-services"
                element={
                  <Suspense fallback={<div className="suspense-loader"></div>}>
                    <LazyAiServicesPage />
                  </Suspense>
                }
              />
              <Route path="/ai-services/interview" element={<InterviewByAI />} />
            </Route>
            <Route
              path="/subscribe"
              element={
                <Suspense fallback={<div className="suspense-loader"></div>}>
                  <LazySubscribePage />
                </Suspense>
              }
            />
            <Route path="/lessonplan/:id" element={<QuestionSlider />} />
            <Route path="/verify-mail" element={<VerifyMail />} />
            <Route
              path="/disputes"
              element={
                <Suspense fallback={<div className="suspense-loader"></div>}>
                  <LazyDisputePage />
                </Suspense>
              }
            />
            <Route path="/faqs" element={<Faq />} />
            <Route
              path="/lesson-plan"
              element={
                <Suspense fallback={<div className="suspense-loader"></div>}>
                  <LazyLessonPlanPage />
                </Suspense>
              }
            />
            <Route
              path="/feedback-analysis"
              element={
                <Suspense
                  fallback={
                    <div className="suspense-loader">
                      <CircularProgress />
                    </div>
                  }
                >
                  <LazyUserFeedbackReportPagePage />
                </Suspense>
              }
            />
            <Route
              path="/profile/*"
              element={
                <Suspense fallback={<div className="suspense-loader"></div>}>
                  <LazyProfilePage />
                </Suspense>
              }
            />
            
            <Route path="/call-to-tutor">
              <Route
                path="/call-to-tutor"
                element={
                  <Suspense fallback={<div className="suspense-loader"></div>}>
                    <CallToTutor />
                  </Suspense>
                }
              />
              <Route path="/call-to-tutor/:id" element={
                  <Suspense fallback={<div className="suspense-loader"></div>}>
                    <CallScreen />
                  </Suspense>
                } />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route
            element={
              <div>
                <Auth />
                <Outlet />
              </div>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
          </Route>
          <Route path="/onboarding" element={<OnBoarding />} />
          <Route path="/update-email" element={<UpdateEmailPage />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;
