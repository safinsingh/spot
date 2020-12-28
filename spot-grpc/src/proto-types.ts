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

type UInt32Value = {
	value: number
}

export type { AuthRequest, User, AuthResponse, FaillableBoolean, UInt32Value }
