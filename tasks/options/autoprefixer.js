module.exports = {
	options: {
		browsers: ['last 3 version']
	},
	multiple_files: {
		expand: true,
		flatten: true,
		src: 'src/styles/*.css',
		dest: 'src/styles/prefixed/'
	}
}