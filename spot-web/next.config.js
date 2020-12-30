module.exports = {
	webpack: (config) => {
		return {
			...config,
			node: {
				...config.node,
				child_process: 'empty'
			}
		}
	}
}
