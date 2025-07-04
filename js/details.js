export class GameDetails {
  constructor() {
    this.apiKey = "8c109481c2msh1bebaa659d89774p161632jsnd277abe67790"
    this.apiHost = "free-to-play-games-database.p.rapidapi.com"
    this.baseUrl = "https://free-to-play-games-database.p.rapidapi.com/api/game"
    this.cache = new Map()
  }

  async fetchGameDetails(gameId) {
    try {
      console.log("Fetching game details for ID:", gameId)

      // Check cache first
      if (this.cache.has(gameId)) {
        console.log("Returning cached data for game:", gameId)
        return this.cache.get(gameId)
      }

      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": this.apiKey,
          "x-rapidapi-host": this.apiHost,
        },
      }

      const url = `${this.baseUrl}?id=${gameId}`
      console.log("Details API URL:", url)
      console.log("Details API Headers:", options.headers)

      const response = await fetch(url, options)

      console.log("Details response status:", response.status)
      console.log("Details response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Details API Error Response:", errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      // response.json() 
      const data = await response.json()
      console.log("Game details received:", data.title)

      // Cache the result
      this.cache.set(gameId, data)

      return data
    } catch (error) {
      console.error("Error fetching game details:", error)
      throw new Error("Failed to load game details. Please try again.")
    }
  }

  async getGameById(gameId) {
    try {
      const gameDetails = await this.fetchGameDetails(gameId)
      return gameDetails
    } catch (error) {
      console.error("Error getting game details:", error)
      throw error
    }
  }

  clearCache() {
    this.cache.clear()
  }

  getCacheSize() {
    return this.cache.size
  }
}
