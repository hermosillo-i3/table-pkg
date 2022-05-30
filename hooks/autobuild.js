const moment = require('moment');
const {exec} = require('child_process');
const fs = require('fs');

const readWriteSyncPackageJSON = (buildId) => {
   const data = fs.readFileSync('./package.json', 'utf-8');
   const jsonObject = JSON.parse(data);
   if (jsonObject.build === buildId) {
      return false;
   }
   jsonObject.build = buildId;
   fs.writeFileSync('./package.json', JSON.stringify(jsonObject, null, 2), 'utf-8');
   console.log('Override package json completed');
};

const getCurrentBuildNumber = () => {
   const data = fs.readFileSync('./package.json', 'utf-8');
   const jsonObject = JSON.parse(data);
   return jsonObject.build;
};

const readWriteSyncChangeLog = (buildId) => {
   const data = fs.readFileSync('./CHANGELOG.md', 'utf-8');
   const newDate = data.replace('[package_build]', `+${buildId}`);
   fs.writeFileSync('./CHANGELOG.md', newDate, 'utf-8');
   console.log('Override CHANGELOG.md completed');
};

const log = (date, now, isFromAmed) => {
   fs.appendFileSync('git-hook.log', `${date.format('HH:mm:ss')} - ${now.format('HH:mm:ss')} = ${isFromAmed} \n`);
};

const addNewChangesToCommit = () => {
   exec('git add .', (error, stdout, stderr) => {
      if (error) {
         console.log(`error: ${error.message}`);
         return;
      }
      if (stderr) {
         console.log(`stderr: ${stderr}`);
         return;
      }
      console.log('Git add completed');
      exec('git commit --amend --no-edit', (error, stdout, stderr) => {
         if (error) {
            console.log(`error: ${error.message}`);
            return;
         }
         if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
         }
         console.log('Git commit completed');
         process.exit(0);
      });
   });
};

const updatePackageBuild = (newCommitDate) => {
   const buildId = moment().unix();
   const currentBuildId = getCurrentBuildNumber();
   const buildBeforeDate = moment.unix(currentBuildId).add(1, 'seconds');
   const now30SecondsBefore = moment.unix(currentBuildId).subtract(30, 'seconds');
   const isFromAmed = newCommitDate.isBetween(now30SecondsBefore, buildBeforeDate);
   log(newCommitDate, buildBeforeDate, isFromAmed);
   if (!isFromAmed) {
      readWriteSyncPackageJSON(`${buildId}`);
      readWriteSyncChangeLog(`${buildId}`);
      addNewChangesToCommit();
   }
};

exec('git rev-list --format=format:\'%cI\' --max-count=1 `git rev-parse HEAD`', (error, stdout, stderr) => {
   if (error) {
      console.log(`error: ${error.message}`);
      return;
   }
   if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
   }
   const gitInformation = stdout.split('\n');
   const date = moment(gitInformation[1]);
   updatePackageBuild(date);
});

