import * as protoLoader from '@grpc/proto-loader'
import * as grpc from 'grpc'
import { join } from 'path'

const protos = ['auth']

export const protoMap: { [key: string]: string } = protos.reduce((acc, cur) => {
	return { ...acc, [cur]: join(__dirname, `../protos/${cur}.proto`) }
}, {})

export const loadProto = (service: string) => {
	const packageDef = protoLoader.loadSync(protoMap[service], {
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true
	})

	const protoDescriptor = grpc.loadPackageDefinition(packageDef)
	return (protoDescriptor['spot'] as grpc.ProtobufMessage)[service]
}
