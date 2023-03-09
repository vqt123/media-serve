import fs from 'fs';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

// let readFile = (filePath: string) => {
// 	return new Promise<Buffer>((resolve) => {
// 		fs.readFile(filePath, (err, buffer) => {
// 			resolve(buffer);
// 		});
// 	});
// };

export const GET: RequestHandler = async ({ locals, url, setHeaders, params }) => {
	let urlParams = Object.fromEntries(url.searchParams);
	let d1 = Date.now();
	let filename = (params as any).filename;
	let fileType = (params as any).filetype;

	let filePath = `z:/images/${filename}.${fileType}`;

	//let buffer = await readFile(filePath);
	let imageBufferWithMetadata = fs.readFileSync(filePath);
	let t1 = sharp(imageBufferWithMetadata).withMetadata();

	//vlog('ELAPSED 2', d3 - d2);
	if (urlParams['blur']) {
		t1 = t1.blur(35);
	}
	if (urlParams['width']) {
		t1 = t1.resize(parseInt(urlParams['width']));
	}

	if (fileType == 'jpg') {
		t1 = t1.jpeg({ quality: 80 });
	}

	if (fileType == 'webp') {
		t1 = t1.webp({ quality: 80 });
	}

	imageBufferWithMetadata = await t1.toBuffer();
	let d4 = Date.now();

	//vlog('ELAPSED 3', d4 - d3);

	setHeaders({
		'Cache-Control': 'max-age=31536000'
	});

	return new Response(imageBufferWithMetadata);
};
