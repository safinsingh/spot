import * as grpc from '@grpc/grpc-js'
import { loadProto } from 'spot-grpc'

import { authenticateRequest } from './rpc'

const { Proto, port } = loadProto('auth')

const Server = new grpc.Server()
Server.addService(Proto.service, {
	authenticate: authenticateRequest
})

// TODO: generate SSL certs
Server.bindAsync(
	`0.0.0.0:${port}`,
	grpc.ServerCredentials.createInsecure(),
	(err, port) => {
		if (err) console.error(err)

		console.log(`Starting server on: 0.0.0.0:${port}`)
		Server.start()
	}
)
