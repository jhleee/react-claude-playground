// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LiquidText from "@/components/LiquidText";
import Menu from "@/components/Menu";
import Counter from "@/components/Counter";
import TrendyRandomChart from "@/components/TrendyRandomChart";
import "./App.css";

function App() {
  const menuItems = [
    { link: "/liquid-text", label: "LiquidText", element: <LiquidText /> },
    { link: "/counter", label: "Counter", element: <Counter /> },
    {
      link: "/TrendyRandomChart",
      label: "TrendyRandomChart",
      element: <TrendyRandomChart />,
    },
  ];

  return (
    <BrowserRouter>
      <div className="min-h-screen layout">
        <main className="h-screen w-screen px-16 py-8">
          <div className="flex flex-col border-collapse border-none rounded-lg overflow-hidden h-[92vh] bg-white">
            <div className="border-b bg-slate-300 flex gap-2 justify-between items-center px-1 py-1">
              <div className="flex">
                <Menu menuItems={menuItems} />
              </div>
              <div className="flex gap-2 pr-3">
                <div className="rounded-full w-3 h-3 bg-green-300"></div>
                <div className="rounded-full w-3 h-3 bg-orange-300"></div>
                <div className="rounded-full w-3 h-3 bg-red-500"></div>
              </div>
            </div>
            <div className="overflow-auto flex-1 h-full min-h-0">
              <Routes>
                {menuItems.map((item) => (
                  <Route path={item.link} element={item.element} />
                ))}
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
