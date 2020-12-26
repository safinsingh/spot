function isInitialAuth(req) {
	return true
}

function authenticate(req) {
	return {
		status: true,
		user: {
			name: 'Safin',
			email: 'safin@mail'
		}
	}
}

const isInitialAuthRequest = (call, callback) => {
	callback(null, isInitialAuth(call.request))
}

const authenticateRequest = (call, callback) => {
	callback(null, authenticate(call.request))
}

export {isInitialAuthRequest, authenticateRequest}
