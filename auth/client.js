const grpc =require( 'grpc')
const protoLoader =require( '@grpc/proto-loader')
const {join}=require('path')
const AUTH_PROTO = join(__dirname, '../proto/auth.proto')

const packageDef = protoLoader.loadSync(AUTH_PROTO, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
})
const protoDescriptor = grpc.loadPackageDefinition(packageDef)
const { spot } = protoDescriptor

const stub = new spot['auth']['AuthService']('localhost:50051', grpc.credentials.createInsecure());
console.log(stub.authenticateRequest({
	email: 'safin@mail',
	password: 'pass'
}, (err, res) => {
	console.log(res)
}))
