# ELECTRON from Scratch

### This guide was made following this one:
[Electron official Docs] (https://www.electronjs.org/docs/latest/tutorial/quick-start)

```mkdir my-app && cd my-app```
```npm init``` ##### (Tuve que abrir PowerShell como administrador)
```npm install --save-dev electron```
En package.json,
 -Modifico 
 main:main.js
 -Agrego script 
 "start": "electron ."

Creo el archivo vacio en el root del proyecto
```npm start```

Creo un archivo "index.html" en el root del proyecto

## Hasta acá:
We bootstrapped a Node.js application and added Electron as a dependency.
We created a main.js script that runs our main process, which controls our app and runs in a Node.js environment. In this script, we used Electron's app and BrowserWindow modules to create a browser window that displays web content in a separate process (the renderer).
In order to access certain Node.js functionality in the renderer, we attached a preload script to our BrowserWindow constructor.

## Para Buildear la aplicacion
```npm install --save-dev @electron-forge/cli``` ##### (Tuve que abrir PowerShell como administrador)
```npx electron-forge import``` ##### (Tuve que abrir PowerShell como administrador)

Esto genera carpeta out, donde encontras el .exe!

## Para loguear en gitCLI
```gh auth login```
Crear Repo desde consola.
``` gh repo create linking-devices --private --description "binding devices over wifi"```

## Para generar certificados autofirmados
```openssl req -nodes -new -x509 -keyout server.key -out server.cert```



Git SSH
     ```ssh-keygen -t rsa -b 4096 -C "ignacio.trezza@gmail.com" -f ~/.ssh/gitignaciotrezza/id_rsa```
     ```eval `ssh-agent -s````
     ```ssh-add ~/.ssh/gitignaciotrezza/id_rsa```
     Paste the public_key in github sshSection


