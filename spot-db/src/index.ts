import * as grpc from '@grpc/grpc-js'
import { loadProto } from 'spot-grpc'

import {
	conn,
	insertUserRecordRequest,
	tableEntryRequest,
	userPassPairExistsRequest
} from './rpc'

const { Proto, port } = loadProto('db')

const Server = new grpc.Server()
Server.addService(Proto.service, {
	tableEntries: tableEntryRequest,
	insertUserRecord: insertUserRecordRequest,
	userPassPairExists: userPassPairExistsRequest
})

// TODO: generate SSL certs
conn.connect().then(() => {
	Server.bindAsync(
		`0.0.0.0:${port}`,
		grpc.ServerCredentials.createInsecure(),
		(err: Error | null, port: number) => {
			if (err) console.error(err)

			console.log(`Starting server on: 0.0.0.0:${port}`)
			Server.start()
		}
	)
})
