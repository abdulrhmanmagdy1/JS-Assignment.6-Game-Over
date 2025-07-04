export class UI {
  constructor() {
    this.gamesContainer = document.getElementById("games-container")
    this.detailsContainer = document.getElementById("game-details-container")
    this.gamesSection = document.getElementById("games-section")
    this.detailsSection = document.getElementById("details-section")
    this.loadingElement = document.getElementById("loading")
    this.backBtn = document.getElementById("back-btn")
  }

  showLoading() {
    console.log("⏳ Showing loading...")
    this.loadingElement.style.display = "flex"
    this.gamesSection.style.display = "none"
    this.detailsSection.style.display = "none"
  }

  hideLoading() {
    console.log("✅ Hiding loading...")
    this.loadingElement.style.display = "none"
  }

  showGamesSection() {
    console.log("🎮 Showing games section...")
    this.gamesSection.style.display = "block"
    this.detailsSection.style.display = "none"
    this.hideLoading()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  showDetailsSection() {
    console.log("📋 Showing details section...")
    this.gamesSection.style.display = "none"
    this.detailsSection.style.display = "block"
    this.hideLoading()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  displayGames(games) {
    console.log("🎯 Displaying games:", games.length)
    this.gamesContainer.innerHTML = ""

    if (!games || games.length === 0) {
      this.showEmptyState()
      return
    }

    games.forEach((game, index) => {
      const gameCard = this.createGameCard(game)
      this.gamesContainer.appendChild(gameCard)

      // Add staggered animation
      setTimeout(() => {
        gameCard.classList.add("fade-in")
      }, index * 50)
    })
  }

  createGameCard(game) {
    const col = document.createElement("div")
    col.className = "col-lg-4 col-md-6 col-sm-12 mb-4"

    const releaseYear = game.release_date ? new Date(game.release_date).getFullYear() : "N/A"
    const shortDescription =
      game.short_description && game.short_description.length > 100
        ? game.short_description.substring(0, 100) + "..."
        : game.short_description || "No description available"

    col.innerHTML = `
        <div class="card game-card h-100" data-game-id="${game.id}">
            <img src="${game.thumbnail}" class="card-img-top" alt="${game.title}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/400x220/2d3748/ffffff?text=Game+Image'">
            <div class="card-body">
                <h5 class="card-title">${game.title}</h5>
                <p class="card-text">${shortDescription}</p>
                <div class="game-meta">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge-genre">${game.genre}</span>
                        <span class="badge-platform">${game.platform}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-muted small">
                        <span>
                            <i class="fas fa-calendar me-1"></i>
                            ${releaseYear}
                        </span>
                        <span>
                            <i class="fas fa-user me-1"></i>
                            ${game.publisher || "Unknown"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `

    return col
  }

  showEmptyState() {
    this.gamesContainer.innerHTML = `
        <div class="col-12">
            <div class="empty-state">
                <i class="fas fa-gamepad"></i>
                <h3>No Games Available</h3>
                <p>Try changing the category or refresh the page</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh me-2"></i>
                    Refresh Page
                </button>
            </div>
        </div>
    `
  }

  showError(message) {
    console.error("❌ Showing error:", message)
    const errorHtml = `
        <div class="col-12">
            <div class="error-message">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Error:</strong> ${message}
                <br><br>
                <button class="btn btn-light" onclick="location.reload()">
                    <i class="fas fa-refresh me-2"></i>
                    Try Again
                </button>
            </div>
        </div>
    `

    if (this.gamesSection.style.display !== "none") {
      this.gamesContainer.innerHTML = errorHtml
    } else {
      this.detailsContainer.innerHTML = errorHtml
    }
  }

  updateCategoryButtons(activeCategory) {
    document.querySelectorAll(".btn-category").forEach((btn) => {
      btn.classList.remove("active")
      if (btn.dataset.category === activeCategory) {
        btn.classList.add("active")
      }
    })
  }

  displayGameDetails(gameDetails) {
    console.log("📋 Displaying game details:", gameDetails.title)

    if (!gameDetails) {
      this.detailsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Failed to load game details
                </div>
            `
      return
    }

    const releaseDate = gameDetails.release_date
      ? new Date(gameDetails.release_date).toLocaleDateString("en-US")
      : "N/A"

    const screenshots =
      gameDetails.screenshots && gameDetails.screenshots.length > 0
        ? gameDetails.screenshots
            .map(
              (screenshot) => `
                <div class="screenshot-item">
                    <img src="${screenshot.image}" alt="Screenshot" loading="lazy" 
                         onerror="this.src='https://via.placeholder.com/400x200/2d3748/ffffff?text=Screenshot'">
                </div>
            `,
            )
            .join("")
        : '<p class="text-muted">No screenshots available</p>'

    const systemRequirements = gameDetails.minimum_system_requirements
      ? this.formatSystemRequirements(gameDetails.minimum_system_requirements)
      : '<p class="text-muted">System requirements not available</p>'

    this.detailsContainer.innerHTML = `
            <div class="details-card slide-in-up">
                <div class="details-header">
                    <div class="row align-items-center">
                        <div class="col-lg-8">
                            <h1 class="details-title">${gameDetails.title}</h1>
                            <p class="details-subtitle">${gameDetails.short_description}</p>
                            <div class="details-badges">
                                <span class="details-badge">
                                    <i class="fas fa-tag me-2"></i>
                                    ${gameDetails.genre}
                                </span>
                                <span class="details-badge">
                                    <i class="fas fa-desktop me-2"></i>
                                    ${gameDetails.platform}
                                </span>
                                <span class="details-badge">
                                    <i class="fas fa-calendar me-2"></i>
                                    ${new Date(gameDetails.release_date).getFullYear()}
                                </span>
                            </div>
                        </div>
                        <div class="col-lg-4 text-center mt-4 mt-lg-0">
                            <img src="${gameDetails.thumbnail}" alt="${gameDetails.title}" 
                                 class="img-fluid game-thumbnail" 
                                 onerror="this.src='https://via.placeholder.com/400x250/2d3748/ffffff?text=Game+Image'">
                        </div>
                    </div>
                </div>
                
                <div class="details-content">
                    <div class="row">
                        <div class="col-lg-8">
                            <h3 class="section-title">
                                <i class="fas fa-info-circle"></i>
                                Game Description
                            </h3>
                            <p class="description-text">${gameDetails.description}</p>
                            
                            <h3 class="section-title">
                                <i class="fas fa-images"></i>
                                Screenshots
                            </h3>
                            <div class="screenshot-gallery">
                                ${screenshots}
                            </div>
                        </div>
                        
                        <div class="col-lg-4">
                            <div class="requirements-card">
                                <h4 class="section-title">
                                    <i class="fas fa-cog"></i>
                                    Game Information
                                </h4>
                                
                                <div class="requirement-item">
                                    <span class="requirement-label">Developer:</span>
                                    <span class="requirement-value">${gameDetails.developer}</span>
                                </div>
                                
                                <div class="requirement-item">
                                    <span class="requirement-label">Publisher:</span>
                                    <span class="requirement-value">${gameDetails.publisher}</span>
                                </div>
                                
                                <div class="requirement-item">
                                    <span class="requirement-label">Release Date:</span>
                                    <span class="requirement-value">${releaseDate}</span>
                                </div>
                                
                                ${systemRequirements}
                                
                                <div class="text-center mt-4">
                                    <a href="${gameDetails.game_url}" target="_blank" 
                                       class="play-button">
                                        <i class="fas fa-play"></i>
                                        Play Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
  }

  formatSystemRequirements(requirements) {
    if (!requirements) return ""

    const reqItems = [
      { label: "OS", value: requirements.os },
      { label: "Processor", value: requirements.processor },
      { label: "Memory", value: requirements.memory },
      { label: "Graphics", value: requirements.graphics },
      { label: "Storage", value: requirements.storage },
    ]

    return reqItems
      .filter((item) => item.value)
      .map(
        (item) => `
                <div class="requirement-item">
                    <span class="requirement-label">${item.label}:</span>
                    <span class="requirement-value">${item.value}</span>
                </div>
            `,
      )
      .join("")
  }
}
