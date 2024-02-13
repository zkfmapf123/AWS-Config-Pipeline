deploy:
	@read -p "Enter the dpleoy lambda function name : " INPUT; \
	export FUNC_NAME=$$INPUT && \
	npm run clean && npm install && npm run zip && \
	aws lambda update-function-code --function-name $$FUNC_NAME --zip-file fileb://function.zip
	