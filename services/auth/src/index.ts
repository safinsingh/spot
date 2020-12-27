import * as grpc from 'grpc'
import { loadProto } from 'spot-grpc'

import { authenticateRequest, isInitialAuthRequest } from './rpc'

const def = loadProto('auth')

const Server = new grpc.Server()
Server.addService(def['AuthService'].service, {
	isInitialAuthRequest,
	authenticateRequest
})

Server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())

Server.start()
