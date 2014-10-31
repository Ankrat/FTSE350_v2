module.exports = {
	options: {
		browsers: ['last 3 version']
	},
	multiple_files: {
		expand: true,
		flatten: true,
		src: 'dist/styles/*.css',
		dest: 'dist/styles/prefixed/'
	}
}