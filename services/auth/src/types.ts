export type AuthRequest = { email: string; password: string }

export type AuthResponse = {
	status: boolean
	user?: { name: string; email: string }
}
