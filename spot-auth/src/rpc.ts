import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js'
import * as grpc from '@grpc/grpc-js'
import {
	AuthRequest,
	AuthResponse,
	DB_USER_ERROR,
	FaillableBoolean,
	loadProto
} from 'spot-grpc'
import { promisify } from 'util'

const { def, port } = loadProto('db')

const stub = new def['DbService'](
	`db-svc:${port}`,
	grpc.credentials.createInsecure()
)

const deadline = new Date()
deadline.setSeconds(deadline.getSeconds() + 5)

stub.waitForReady(deadline, (err?: Error) => {
	if (err) {
		console.error(`Failed to connect to db-svc:${port}:\n\t${err.message}`)
	} else {
		console.log(`Stub is ready for connections to: db-svc:${port}`)
	}
})

const tableEntriesAsync = promisify(stub.tableEntries).bind(stub)
const insertUserRecordAsync = promisify(stub.insertUserRecord).bind(stub)
const userPassPairExistsAsync = promisify(stub.userPassPairExists).bind(stub)

// Authentication process:
// 1. Is the number of table rows 0 or 1? No -> Return a failure
// 2. If number of table rows is 0, create the user and return the response from the stub
// 3. If the number of table rows is 1, check if the userPassPair exists
//    If so, just return the response; if not -> return a failure
const authenticate = async (req: AuthRequest): Promise<AuthResponse> => {
	try {
		const { value } = await tableEntriesAsync({})
		switch (value) {
			case 0:
				const a = await insertUserRecordAsync(req)
				return a
			case 1:
				const valid = (await userPassPairExistsAsync(
					req
				)) as FaillableBoolean

				if (valid.error) throw Error(valid.error)
				if (!valid.response) throw Error('Invalid credentials!')
				return { status: true, user: { email: req.email } }
			default:
				throw Error(DB_USER_ERROR)
		}
	} catch (err: any) {
		return { status: false, error: err.message ?? err ?? DB_USER_ERROR }
	}
}

const authenticateRequest = (
	call: ServerUnaryCall<AuthRequest, AuthResponse>,
	callback: sendUnaryData<AuthResponse>
) => {
	authenticate(call.request).then((res) => callback(null, res))
}

export { authenticateRequest }
