(() => {
	const fs = require("fs");
	var jscompose = function(path,options){
		this.options = options || {};
		if(path === undefined || path === null){
			return this._message(true,"The path is not specified");
		}

		if(!fs.existsSync(path)){
			return this._message(true,"File Not Found");
		}

		let jsFile = fs.readFileSync(path);
		if(!jsFile){
			return this._message(true,"Can't Read The File");
			return false;
		}

		let jsStr = jsFile.toString();

		let dir = path.replace(/([^/]+)\.js$/,"");
		let match = jsStr.matchAll(/require\(\"([^"]+)\"\)\;\n?/g);
		for(let i of match){
			jsStr = jsStr.replace(i[0],"");
			let file = i[1];
			if(!file.match(/\.js$/)){
				file += ".js";
			}
			if(fs.existsSync(dir+file)){
				jsStr += fs.readFileSync(dir+file).toString()+"\n";
			} else {
				jsStr += `// ${file} Not Found\n`;
			}
		}

		this._message = (err,result) => {
			if(err){
				if(this.options.test){
					throw new Error(result);
				}
				return false;
			}
			return result;
		};

		return jsStr;
	};
	module.exports = jscompose;
})();