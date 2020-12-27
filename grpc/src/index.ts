import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { join } from 'path'

const protos = ['auth']
const BASE_PORT_NUM = 5000

export const protoMap: {
	[key: string]: { path: string; port: number }
} = protos.reduce((acc, cur, idx) => {
	return {
		...acc,
		[cur]: {
			port: BASE_PORT_NUM + idx,
			path: join(__dirname, `../../proto/${cur}.proto`)
		}
	}
}, {})

export const loadProto = (service: string): { def: any; port: number } => {
	const packageDef = protoLoader.loadSync(protoMap[service].path, {
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true
	})

	const protoDescriptor = grpc.loadPackageDefinition(packageDef)
	return {
		port: protoMap[service].port,
		def: (protoDescriptor['spot'] as grpc.GrpcObject)[service]
	}
}
