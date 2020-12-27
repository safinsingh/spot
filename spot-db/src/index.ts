import * as grpc from '@grpc/grpc-js'
import { loadProto } from 'spot-grpc'

import {
	insertUserRecordRequest,
	userPassPairExistsRequest,
	userTableEmptyRequest
} from './rpc'

const { def, port } = loadProto('db')

const Server = new grpc.Server()
Server.addService(def['DbService'].service, {
	usertableempty: userTableEmptyRequest,
	insertuserrecord: insertUserRecordRequest,
	userpasspairexists: userPassPairExistsRequest
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
