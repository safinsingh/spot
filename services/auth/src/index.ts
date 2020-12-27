import * as grpc from '@grpc/grpc-js'
import { loadProto } from 'spot-grpc'

import { authenticateRequest } from './rpc'

const { def, port } = loadProto('auth')

const Server = new grpc.Server()
Server.addService(def['AuthService'].service, {
	authenticate: authenticateRequest
})

// TODO: generate SSL certs
Server.bindAsync(
	`127.0.0.1:${port}`,
	grpc.ServerCredentials.createInsecure(),
	(err, port) => {
		if (err) console.error(err)

		console.log(`Starting server on: 127.0.0.1:${port}`)
		Server.start()
	}
)
