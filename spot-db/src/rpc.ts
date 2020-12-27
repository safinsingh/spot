import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import type { AuthRequest, AuthResponse, FaillableBoolean } from 'spot-grpc'

const userTableEmpty = (_req: {}): FaillableBoolean => {
	return {
		status: true,
		response: true
	}
}

const userTableEmptyRequest = (
	call: ServerUnaryCall<{}, FaillableBoolean>,
	callback: sendUnaryData<FaillableBoolean>
) => {
	callback(null, userTableEmpty(call.request))
}

const insertUserRecord = (req: AuthRequest): AuthResponse => {
	return {
		status: true,
		user: {
			email: req.email
		}
	}
}

const insertUserRecordRequest = (
	call: ServerUnaryCall<AuthRequest, AuthResponse>,
	callback: sendUnaryData<AuthResponse>
) => {
	callback(null, insertUserRecord(call.request))
}

const userPassPairExists = (_req: AuthRequest): FaillableBoolean => {
	return {
		status: true,
		response: false
	}
}

const userPassPairExistsRequest = (
	call: ServerUnaryCall<AuthRequest, FaillableBoolean>,
	callback: sendUnaryData<FaillableBoolean>
) => {
	callback(null, userPassPairExists(call.request))
}

export {
	userTableEmptyRequest,
	insertUserRecordRequest,
	userPassPairExistsRequest
}
