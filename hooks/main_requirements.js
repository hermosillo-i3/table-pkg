const {exec} = require('child_process');

const execute = async (command) => {
   return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
         if (error) {
            reject(error)
         } else if (stderr) {
            reject(stderr)
         } else {
            resolve(stdout)
         }
      })
   })
}

const main = async () => {
   const branch = await execute('git rev-parse --abbrev-ref HEAD');
// jiji hello
   const branchName = 'husky-test';
   if (branch.trim() === branchName) {
      // Only works on master branch
      const originRaw = await execute(`git show origin/${branchName}:package.json`);
      const currentRaw = await execute(`git show ${branchName}:package.json`);
      const origin = JSON.parse(originRaw);
      const current = JSON.parse(currentRaw);

      const filesChanged = await execute('git diff origin/main main --name-only --pretty=format:')

      const hasUpdateChangeLog = filesChanged.includes('CHANGELOG.md')
      if (!hasUpdateChangeLog) {
         throw new Error('El CHANGELOG no se ha actualizado.')
      }

      if (origin.version === current.version) {
         throw new Error('La versión del package.json no se ha actualizado')
      }
   }
}
main().then((data) => {
   console.log('Se ejecutó correctamente')
}).catch((e) => {
   console.error(e.message)
   process.exit(1)
});

