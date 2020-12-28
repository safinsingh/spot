import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import * as grpc from '@grpc/grpc-js'
import {
	AuthRequest,
	AuthResponse,
	DB_USER_ERROR,
	FaillableBoolean,
	loadProto
} from 'spot-grpc'

const { def, port } = loadProto('db')

const stub = new def['DbService'](
	`0.0.0.0:${port}`,
	grpc.credentials.createInsecure()
)

const deadline = new Date()
deadline.setSeconds(deadline.getSeconds() + 5)

stub.waitForReady(deadline, (err?: Error) => {
	if (err) {
		console.error(`Failed to connect to 0.0.0.0:${port}:\n\t${err.message}`)
	} else {
		console.log(`Stub is ready for connections to: 0.0.0.0:${port}`)
	}
})

// Authentication process:
// 1. Is the number of table rows 0 or 1? No -> Return a failure
// 2. If number of table rows is 0, create the user and return the response from the stub
// 3. If the number of table rows is 1, check if the userPassPair exists
//    If so, just return the response; if not -> return a failure
const authenticate = async (req: AuthRequest): Promise<AuthResponse> => {
	let result: AuthResponse = { status: false, error: DB_USER_ERROR }
	stub.tableEntries({}, (err: Error | null, res: number) => {
		if (err) result = { status: false, error: err.message }
		switch (res) {
			case 0:
				stub.insertUserRecord(
					req,
					(err2: Error | null, res2: AuthResponse) => {
						if (err2)
							result = { status: false, error: err2.message }
						result = res2
					}
				)
			case 1:
				stub.userPassPairExists(
					req,
					(err2: Error | null, res2: FaillableBoolean) => {
						if (err2)
							result = { status: false, error: err2.message }
						if (!res2.status)
							result = { status: res2.status, error: res2.error }
						if (!res2.response)
							result = {
								status: res2.status,
								error: DB_USER_ERROR
							}
						result = {
							status: true,
							user: { email: req.email }
						}
					}
				)
		}
	})

	return result
}

const authenticateRequest = (
	call: ServerUnaryCall<AuthRequest, AuthResponse>,
	callback: sendUnaryData<AuthResponse>
) => {
	authenticate(call.request).then((res) => callback(null, res))
}

export { authenticateRequest }
