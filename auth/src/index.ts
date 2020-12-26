import { join } from 'path'
import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'
import {isInitialAuthRequest, authenticateRequest} from './rpc'

const AUTH_PROTO = join(__dirname, '../../proto/auth.proto')

const packageDef = protoLoader.loadSync(AUTH_PROTO, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
})
const protoDescriptor = grpc.loadPackageDefinition(packageDef)
const { spot } = protoDescriptor

const Server = new grpc.Server()
Server.addService(spot['auth']['AuthService'].service, {
	isInitialAuthRequest,
	authenticateRequest
})

Server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

console.log('starting gRPC server')
Server.start();
