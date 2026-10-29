
import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadVideo from "./pages/UploadVideo";
import WatchVideo from "./pages/WatchVideo";
import Channel from "./pages/Channel";
import { getAccessToken } from "./services/api";
import { logoutUser } from "./services/authService";
import { LogIn, LogOut } from "lucide-react";


function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(getAccessToken())
  );

  const navigate = useNavigate();

  function handleSearch(query) {
    setSearchQuery(query);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar
        onMenuClick={() => setSidebarOpen((open) => !open)}
        onSearch={handleSearch}
        isLoggedIn={isLoggedIn}
        onLogout={async () => {
          try {
            await logoutUser();
          } finally {
            setIsLoggedIn(false);
            navigate("/login");
          }
        }}
      />

      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  searchQuery={searchQuery}
                  onSearchClear={() => setSearchQuery("")}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login onLoginSuccess={() => setIsLoggedIn(true)} />
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<UploadVideo />} />
            <Route path="/watch/:videoId" element={<WatchVideo />} />
            <Route path="/channel" element={<Channel />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
