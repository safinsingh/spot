import * as grpc from '@grpc/grpc-js'
import { FaillableBoolean, loadProto } from 'spot-grpc'

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
	}
})

const onReady = () => {
	stub.authenticate(
		{
			user: 'safin',
			password: 'pass'
		},
		(err: Error | null, res: FaillableBoolean) => {
			if (err) console.error(err)
			console.log(res)
		}
	)
}
