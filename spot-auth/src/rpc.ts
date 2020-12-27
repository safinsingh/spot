import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import type { AuthRequest, AuthResponse } from 'spot-grpc'

const authenticate = (req: AuthRequest): AuthResponse => {
	return {
		status: true,
		user: {
			email: 'safin@mail'
		}
	}
}

const authenticateRequest = (
	call: ServerUnaryCall<AuthRequest, AuthResponse>,
	callback: sendUnaryData<AuthResponse>
) => {
	callback(null, authenticate(call.request))
}

export { authenticateRequest }
