@echo off
@echo ========= Subiendo cambios... ===========
SET /P MSG=Escribe el mensaje del commit: 
git add -A
git commit -am "%MSG%"
git pull
git commit -am "%MSG%"
git push
git status
