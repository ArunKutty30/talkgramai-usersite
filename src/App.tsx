import React from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "react-calendar/dist/Calendar.css";

import { userStore } from "./store/userStore";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import SplashScreen from "./components/SplashScreen";
import Header from "./components/Header";
import Auth from "./pages/Auth/Auth";
import Sessions from "./pages/Sessions";
import ReferAndEarn from "./pages/ReferAndEarn";
import Subscribe from "./pages/Subscribe";
import Profile from "./pages/Profile";
import BookSession from "./pages/BookSession";
import PageNotFound from "./pages/PageNotFound";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import QuestionSlider from "./components/Slider";
import VerifyMail from "./pages/VerifyMail";
import OnBoarding from "./pages/Auth/OnBoarding";
import Dispute from "./pages/Dispute";
import Copyright from "./components/Copyright";
import LessonPlan from "./pages/lessonPlan";
import UserFeedbackReportPage from "./pages/UserFeedbackReportPage";
import Faq from "./pages/Faq";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f7941f",
    },
  },
});

const App: React.FC = () => {
  const isFetching = userStore((state) => state.isFetching);
  const location = useLocation();
  const shouldShowHeader = !location.pathname.startsWith("/session/");

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
                <Copyright />
              </div>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/book-session" element={<BookSession />} />
            <Route path="/book-demo-session" element={<BookSession />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/refer-and-earn" element={<ReferAndEarn />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/lessonplan/:id" element={<QuestionSlider />} />
            <Route path="/verify-mail" element={<VerifyMail />} />
            <Route path="/disputes" element={<Dispute />} />
            <Route path="/lesson-plan" element={<LessonPlan />} />
            <Route path="/feedback-analysis" element={<UserFeedbackReportPage />} />
            <Route path="/faqs" element={<Faq />} />

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
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;
