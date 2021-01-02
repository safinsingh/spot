import * as grpc from '@grpc/grpc-js'
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client'
import * as protoLoader from '@grpc/proto-loader'
import { join } from 'path'

const protos = ['auth', 'db']
const BASE_PORT_NUM = 5001

export const protoMap: {
	[key: string]: { path: string; port: number; service: string }
} = protos.reduce((acc, cur, idx) => {
	return {
		...acc,
		[cur]: {
			port: BASE_PORT_NUM + idx,
			path: join(__dirname, `../../spot-proto/${cur}.proto`),
			service: cur.charAt(0).toUpperCase() + cur.slice(1) + 'Service'
		}
	}
}, {})

export const loadProto = (
	service: string
): { Proto: ServiceClientConstructor; port: number } => {
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
		Proto: (protoDescriptor['spot'] as grpc.GrpcObject)[
			protoMap[service].service
		] as ServiceClientConstructor
	}
}

export * from './proto-types'
export * from './errors'
