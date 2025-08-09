import "./globals.css";
import * as React from "react";

export const metadata = {
  title: "Expense Tracker",
  description: "Personal expense tracker (localStorage)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-700 dark:bg-gray-900 text-gray-100 dark:text-gray-100 min-h-screen">
        <div className="min-h-screen flex flex-col bg-gray-800">
          {/* Header */}
          <header className="bg-gray-900 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-40">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 via-blue-400 to-blue-400 bg-clip-text text-transparent">
                    Finance
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Monthly Expenses</p>
                </div>

                <nav aria-label="Primary navigation">
                  <ul className="flex space-x-6 text-sm font-medium">
                    <li>
                      <a
                        href="/"
                        className="text-gray-300 hover:text-purple-400 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-gray-700/50"
                      >
                        Daily
                      </a>
                    </li>
                    <li>
                      <a
                        href="/weekly"
                        className="text-gray-300 hover:text-purple-400 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-gray-700/50"
                      >
                        Weekly
                      </a>
                    </li>
                    <li>
                      <a
                        href="/stats"
                        className="text-gray-300 hover:text-purple-400 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-gray-700/50"
                      >
                        Stats
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-600/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-600/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-8 py-6 text-center text-xs bg-gray-900 text-white select-none border-t border-gray-700/50">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              Built for personal use — data stays on your device.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
