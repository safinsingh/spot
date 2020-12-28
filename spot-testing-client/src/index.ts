import * as grpc from '@grpc/grpc-js'
import { AuthResponse, loadProto } from 'spot-grpc'
import { promisify } from 'util'

const { def, port } = loadProto('auth')

const stub = new def['AuthService'](
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
		onReady()
			.then((res) => console.log(res))
			.catch((e) => console.error(e))
	}
})

const authenticateAsync = promisify(stub.authenticate).bind(stub)

const onReady = async (): Promise<AuthResponse> => {
	try {
		const res = await authenticateAsync({
			email: 'safin@mail',
			password: 'pass'
		})

		return res as AuthResponse
	} catch (e) {
		return { status: false, error: e }
	}
}
