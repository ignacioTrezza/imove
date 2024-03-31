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

Correr Angular
```cd PUBLIC && npx ng serve```	

For generate the dist/browser FrontEnd into electron Project
```cd PUBLIC && npx ng build```	







CONFLICTO DE REFERENCIAS DE REMAS:
El mensaje de `git fsck --full` indica varios problemas, incluyendo punteros SHA1 inválidos para tu rama `store_integration` tanto en local como en remoto, y también problemas con `HEAD`. Esto sugiere que las referencias de tu rama están corruptas. Aquí hay pasos detallados para intentar solucionar estos problemas:

### 1. Corregir el puntero HEAD

Primero, asegúrate de que el puntero `HEAD` esté correcto. Si `HEAD` está dañado, puedes intentar corregirlo manualmente:

```bash
echo ref: refs/heads/master > .git/HEAD
```

Este comando cambia el `HEAD` a apuntar a la rama `master`. Puedes reemplazar `master` con otra rama si prefieres cambiar a una diferente.

### 2. Eliminar referencias corruptas

Dado que las referencias de `store_integration` están corruptas, puedes intentar eliminarlas y luego restaurarlas desde el remoto (si están disponibles allí) o reconstruirlas manualmente si conoces un commit seguro al que puedan apuntar.

Para eliminar las referencias corruptas:

```bash
rm .git/refs/heads/store_integration
rm .git/refs/remotes/origin/store_integration
rm .git/logs/refs/heads/store_integration
rm .git/logs/refs/remotes/origin/store_integration
```

### 3. Recuperar la rama desde el remoto

Después de eliminar las referencias corruptas, intenta recuperar la rama desde el repositorio remoto:

```bash
git fetch origin
git checkout -b store_integration origin/store_integration
```

Este conjunto de comandos intentará crear una nueva rama `store_integration` local basada en la rama remota `origin/store_integration`.
Generalmente Hasta aca se soluciona!

### 4. Si la rama no existe en el remoto o el problema persiste

Si la rama `store_integration` no existe en el remoto o si el problema persiste, puedes intentar reconstruir la rama manualmente utilizando un commit seguro conocido. Si tienes un commit "dangling" (huérfano) que sabes que pertenece a la rama, puedes intentar recuperarlo:

```bash
git checkout -b new_store_integration <dangling_commit_hash>
```

Reemplaza `<dangling_commit_hash>` con el hash de un commit huérfano que creas que pertenece a tu rama. Puedes usar los hashes de commit listados como "dangling" por `git fsck`.

### 5. Verificar y continuar

Después de recuperar o reconstruir la rama, verifica que todo esté en orden ejecutando:

```bash
git log
```

Esto te mostrará los commits en la rama para asegurarte de que estás en el estado deseado.

### Nota

Si estos pasos no resuelven el problema o si te sientes incómodo realizándolos, considera pedir ayuda a un colega o un profesional con experiencia en recuperación de Git. En casos extremos, si tienes un backup reciente del repositorio o si el código está seguro en otro lugar (como en una rama remota o en el repositorio de un colaborador), podría ser más seguro clonar el repositorio nuevamente o restaurar desde el backup.