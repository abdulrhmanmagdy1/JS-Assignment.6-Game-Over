export class Games {
  constructor() {
    this.apiKey = "8c109481c2msh1bebaa659d89774p161632jsnd277abe67790"
    this.apiHost = "free-to-play-games-database.p.rapidapi.com"
    this.baseUrl = "https://free-to-play-games-database.p.rapidapi.com/api/games"
    this.allGames = []
    this.currentCategory = ""
  }

  async fetchGames(category = "") {
    try {
      console.log("Fetching games for category:", category)

      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": this.apiKey,
          "x-rapidapi-host": this.apiHost,
        },
      }

      let url = this.baseUrl
      if (category && category.trim() !== "") {
        url += `?category=${category}`
      }

      console.log("API URL:", url)
      console.log("API Headers:", options.headers)

      const response = await fetch(url, options)

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      // Use response.json() instead of response.text()
      const data = await response.json()
      console.log("Games data received:", data.length, "games")
      console.log("First game sample:", data[0])

      return data
    } catch (error) {
      console.error("Error fetching games:", error)

      // Try to fetch without category as fallback
      if (category) {
        console.log("Retrying without category...")
        return this.fetchGames("")
      }

      throw new Error("Failed to load games. Please check your internet connection and try again.")
    }
  }

  async loadGames(category = "") {
    try {
      this.currentCategory = category
      const games = await this.fetchGames(category)
      this.allGames = games
      return games
    } catch (error) {
      console.error("Error loading games:", error)
      throw error
    }
  }

  getGameById(gameId) {
    return this.allGames.find((game) => game.id == gameId)
  }

  searchGames(searchTerm) {
    if (!searchTerm || searchTerm.trim() === "") {
      return this.allGames
    }

    const term = searchTerm.toLowerCase().trim()
    return this.allGames.filter(
      (game) =>
        game.title.toLowerCase().includes(term) ||
        game.genre.toLowerCase().includes(term) ||
        game.publisher.toLowerCase().includes(term),
    )
  }

  getGamesByGenre(genre) {
    if (!genre || genre === "") {
      return this.allGames
    }

    return this.allGames.filter((game) => game.genre.toLowerCase().includes(genre.toLowerCase()))
  }

  getAvailableGenres() {
    const genres = [...new Set(this.allGames.map((game) => game.genre))]
    return genres.sort()
  }

  getGameStats() {
    return {
      total: this.allGames.length,
      genres: this.getAvailableGenres().length,
      platforms: [...new Set(this.allGames.map((game) => game.platform))].length,
    }
  }
}
