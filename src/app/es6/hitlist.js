import glob from 'glob';
import fs from 'fs';

const fileExists = filePath =>
{
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
};

const filesConverted = [];
const filesRemaining = [];

glob('**/*.js', {
	ignore: ['**/es6/**','**/node_modules/**', '**/bower_components/**'] 
}, (err, files) => {
	for(let file of files) {
		let es6File = file.replace(/(.*)\/(.*)/, "$1/es6/$2");
		if (es6File.indexOf('/') === -1) es6File = 'es6/' + es6File;
		if (fileExists(es6File)) filesConverted.push(es6File);
		else filesRemaining.push(file);
	}

	const summary = () => {
		console.log('\n');
		console.log('Total JS files: ', filesConverted.length + filesRemaining.length);
		console.log('Converted: ', filesConverted.length);
		console.log('Remaining: ', filesRemaining.length);
		console.log('% Completed: ', filesConverted.length/(filesConverted.length + filesRemaining.length));
		console.log('\n');
	};

	summary();

	console.log('Remaining:');
	console.log(filesRemaining);
	console.log('\n');
	console.log('Converted:');
	console.log(filesConverted);

	summary();
});