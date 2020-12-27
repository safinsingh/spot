type AuthRequest = { email: string; password: string }

type User = { email: string }

type AuthResponse = {
	status: boolean
	error?: string
	user?: User
}

type FaillableBoolean = {
	status: boolean
	error?: string
	response?: boolean
}

export type { AuthRequest, User, AuthResponse, FaillableBoolean }
