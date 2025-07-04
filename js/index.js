import { Games } from "./games.js"
import { GameDetails } from "./details.js"
import { UI } from "./ui.js"

class GameApp {
  constructor() {
    this.games = new Games()
    this.gameDetails = new GameDetails()
    this.ui = new UI()
    this.currentCategory = ""
    this.init()
    this.loadingTimeout = setTimeout(() => {
      if (document.getElementById("loading").style.display !== "none") {
        this.ui.showError("⏳ Games won't load! Check your internet connection, API Key validity, or CORS policy. Try refreshing the page or using a VPN.")
        this.ui.hideLoading()
      }
    }, 5000)
  }

  async init() {
    try {
      console.log("🎮 Initializing GameApp...")
      this.setupEventListeners()
      await this.loadInitialGames()
    } catch (error) {
      console.error("❌ Error initializing app:", error)
      this.ui.showError("Failed to initialize application: " + error.message)
      this.ui.hideLoading()
    }
  }

  setupEventListeners() {
    console.log("🔧 Setting up event listeners...")

    // Back button event
    this.ui.backBtn.addEventListener("click", () => {
      console.log("⬅️ Back button clicked")
      this.ui.showGamesSection()
    })

    // Category filter events
    document.querySelectorAll(".btn-category").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        console.log("🏷️ Category button clicked:", e.target.dataset.category)
        const category = e.target.dataset.category
        await this.loadGamesByCategory(category)
      })
    })

    // Game card click events (event delegation)
    this.ui.gamesContainer.addEventListener("click", async (e) => {
      const gameCard = e.target.closest(".game-card")
      if (gameCard) {
        const gameId = gameCard.dataset.gameId
        console.log("🎯 Game card clicked, ID:", gameId)
        await this.showGameDetails(gameId)
      }
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.ui.detailsSection.style.display !== "none") {
        this.ui.showGamesSection()
      }
    })
  }

  async loadInitialGames() {
    try {
      console.log("🚀 Loading initial games...")
      this.ui.showLoading()
      await new Promise((resolve) => setTimeout(resolve, 500))
      const games = await this.games.loadGames()
      console.log("✅ Initial games loaded:", games.length)
      if (games && games.length > 0) {
        this.ui.displayGames(games)
        this.ui.showGamesSection()
        this.ui.updateCategoryButtons("")
        clearTimeout(this.loadingTimeout)
      } else {
        throw new Error("No games received from API")
      }
    } catch (error) {
      console.error("❌ Error loading initial games:", error)
      this.ui.showError(error.message || "Failed to load games")
      this.ui.hideLoading()
      clearTimeout(this.loadingTimeout)
    }
  }

  async loadGamesByCategory(category) {
    try {
      console.log("🏷️ Loading games by category:", category)
      this.ui.showLoading()
      this.currentCategory = category

      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300))

      const games = await this.games.loadGames(category)
      console.log("✅ Games loaded for category:", category, "Count:", games.length)

      if (games && games.length > 0) {
        this.ui.displayGames(games)
        this.ui.showGamesSection()
        this.ui.updateCategoryButtons(category)

        // Update page title
        const categoryName = this.getCategoryDisplayName(category)
        document.title = `Free Games Store - ${categoryName}`
      } else {
        this.ui.showEmptyState()
        this.ui.showGamesSection()
        this.ui.updateCategoryButtons(category)
      }
    } catch (error) {
      console.error("❌ Error loading games by category:", error)
      this.ui.showError(error.message || "Failed to load games")
      this.ui.hideLoading()
    }
  }

  async showGameDetails(gameId) {
    try {
      console.log("🔍 Showing game details for ID:", gameId)
      this.ui.showLoading()

      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300))

      const gameDetails = await this.gameDetails.getGameById(gameId)

      if (gameDetails) {
        console.log("✅ Game details loaded:", gameDetails.title)
        this.ui.displayGameDetails(gameDetails)
        this.ui.showDetailsSection()

        // Update page title
        document.title = `${gameDetails.title} - Free Games Store`
      } else {
        throw new Error("Game details not found")
      }
    } catch (error) {
      console.error("❌ Error showing game details:", error)
      this.ui.showError(error.message || "Failed to load game details")
      this.ui.hideLoading()
    }
  }

  getCategoryDisplayName(category) {
    const categoryNames = {
      "": "All Games",
      shooter: "Shooter Games",
      mmorpg: "MMORPG Games",
      strategy: "Strategy Games",
      racing: "Racing Games",
      sports: "Sports Games",
    }

    return categoryNames[category] || "Games"
  }

  // Public methods for external access
  getCurrentCategory() {
    return this.currentCategory
  }

  getGameStats() {
    return this.games.getGameStats()
  }

  async refreshGames() {
    await this.loadGamesByCategory(this.currentCategory)
  }
}

// Test API connection on load
async function testAPIConnection() {
  console.log("🧪 Testing API connection...")

  try {
    const testOptions = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "8c109481c2msh1bebaa659d89774p161632jsnd277abe67790",
        "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      },
    }

    const testUrl = "https://free-to-play-games-database.p.rapidapi.com/api/games"
    console.log("🔗 Test URL:", testUrl)

    const response = await fetch(testUrl, testOptions)
    console.log("📡 Test Response Status:", response.status)
    console.log("✅ Test Response OK:", response.ok)

    if (response.ok) {
      const data = await response.json()
      console.log("🎮 Test API Success! Games count:", data.length)
      return true
    } else {
      const errorText = await response.text()
      console.error("❌ Test API Error:", errorText)
      return false
    }
  } catch (error) {
    console.error("❌ Test API Connection Failed:", error)
    return false
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🌐 DOM loaded, testing API connection...")

  // Test API first
  const apiWorking = await testAPIConnection()

  if (apiWorking) {
    console.log("✅ API is working, initializing app...")
    window.gameApp = new GameApp()
  } else {
    console.error("❌ API is not working, showing error...")
    document.getElementById("loading").innerHTML = `
      <div class="loading-content">
        <div class="error-message">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <strong>API Connection Failed</strong><br>
          Please check your internet connection and try again.
          <br><br>
          <button class="btn btn-primary" onclick="location.reload()">
            <i class="fas fa-refresh me-2"></i>
            Retry
          </button>
        </div>
      </div>
    `
  }
})

// Export for potential external use
export default GameApp
