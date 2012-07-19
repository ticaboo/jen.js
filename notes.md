notes.md - git ignored notes, ultimatly for readme.md


help:


-t : set the template folder, defaults to jen/template


templating:

	built in paramters:

	{{dir}} The directory the generator is being run from.

	Often you want to use the parent directory name in your folder names, file names and inside the code.

	built in helpers:




File/Folder naming:

	You can name files/folders using the handlebar templating:
	{{app}}/
	{{param}}-controller.js

	Naming a folder is a common usecase. e.g.:

	jen app  myapp

	creates:
		myapp
		|--controllers
		|    |--main-controller.js
		|
		|--models
		     |--main-model.js



