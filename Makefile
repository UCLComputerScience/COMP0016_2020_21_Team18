lint-connect:
	mv .git/hooks/pre-commit.sample .git/hooks/pre-commit
	echo "git-pylint-commit-hook" >> .git/hooks/pre-commit

up:
	docker build --tag grace-chatbot .
	docker run --publish 5000:5000 --env-file ./.env --name grace-chatbot grace-chatbot

down:
	docker stop grace-chatbot
	docker container rm grace-chatbot