import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import type {
	AuthRequest,
	AuthResponse,
	FaillableBoolean,
	UInt32Value
} from 'spot-grpc'
import { DB_USER_ERROR } from 'spot-grpc'
import { getConnectionManager } from 'typeorm'

import { User } from './models'

const connManager = getConnectionManager()
export const conn = connManager.create({
	type: 'postgres',
	url: process.env.DB_URL,
	entities: [User],
	synchronize: true,
	logging: false
})

const tableEntries = async (_req: {}): Promise<UInt32Value> => {
	return { value: await conn.manager.count(User) }
}

const tableEntryRequest = async (
	call: ServerUnaryCall<{}, UInt32Value>,
	callback: sendUnaryData<UInt32Value>
) => {
	tableEntries(call.request).then((res) => callback(null, res))
}

const insertUserRecord = async ({
	email,
	password
}: AuthRequest): Promise<AuthResponse> => {
	const user = new User(email, password)
	const res = await conn.manager.save(user)

	return {
		status: res.getId() === 1,
		error: res.getId() === 1 ? '' : DB_USER_ERROR,
		user: {
			email: res.getEmail()
		}
	}
}

const insertUserRecordRequest = (
	call: ServerUnaryCall<AuthRequest, AuthResponse>,
	callback: sendUnaryData<AuthResponse>
) => {
	insertUserRecord(call.request).then((res) => callback(null, res))
}

const userPassPairExists = async ({
	email,
	password
}: AuthRequest): Promise<FaillableBoolean> => {
	const users = await conn.manager.find(User, {
		where: {
			id: 1,
			email,
			password
		}
	})

	return {
		status: true,
		response: users.length === 1
	}
}

const userPassPairExistsRequest = (
	call: ServerUnaryCall<AuthRequest, FaillableBoolean>,
	callback: sendUnaryData<FaillableBoolean>
) => {
	userPassPairExists(call.request).then((res) => callback(null, res))
}

export { tableEntryRequest, insertUserRecordRequest, userPassPairExistsRequest }
