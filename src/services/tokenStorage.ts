/**
 * Token storage - in-memory only (cleared on page reload)
 * This avoids circular dependencies between auth.ts and api.ts
 */

class TokenStorage {
  private token: string | null = null

  setToken(token: string): void {
    this.token = token
  }

  getToken(): string | null {
    return this.token
  }

  removeToken(): void {
    this.token = null
  }
}

export const tokenStorage = new TokenStorage()
