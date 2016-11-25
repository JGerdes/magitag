var gulp = require('gulp'),
    fs = require('fs'),
    exec = require('child_process').exec;

var config = JSON.parse(fs.readFileSync('./gulpconfig.json'));

gulp.task('default', ['reload']);

gulp.task('watch', function () {
    gulp.watch('script/*.js', ['reload']);
});

gulp.task('reload', function () {
    console.log('reload app from ' + process.cwd());
    exec(config.chromePath + ' --load-and-launch-app=' + process.cwd(),
        function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        }
    );
});