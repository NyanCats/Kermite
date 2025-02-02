import {
  executeCommand,
  fsExistsSync,
  fsRmdirSync,
  fsxCopyDirectory,
} from "./helpers";
import { deployStageIndexUpdator_updateIndexIfFilesChanged } from "./subTasks/deployStageIndexUpdator";
import { deployStageProjectsBuilder_buildProjects } from "./subTasks/deployStageProjectsBuilder";
import { deployStageSummaryUpdator_outputSummaryFile } from "./subTasks/deployStageSummaryUpdator";

process.chdir("..");

function pullResourceStoreRepo() {
  if (!fsExistsSync("KRS")) {
    executeCommand(
      `git clone https://github.com/yahiro07/KermiteResourceStore.git KRS`
    );
  }
}

function copyResourcesToLocalResourceStoreRepo() {
  fsRmdirSync("./KRS/resources", { recursive: true });
  fsxCopyDirectory("./dist", "./KRS/resources");
}

function buildAllProjectDistributions() {
  pullResourceStoreRepo();
  const buildStats = deployStageProjectsBuilder_buildProjects();
  const successRate = buildStats.numSuccess / buildStats.numTotal;
  if (!(successRate > 0.9)) {
    console.log(`failed to build some projects, abort`);
    process.exit(-1);
  }
  const changeRes = deployStageIndexUpdator_updateIndexIfFilesChanged();
  deployStageSummaryUpdator_outputSummaryFile(buildStats, changeRes);
  copyResourcesToLocalResourceStoreRepo();
  console.log("done");
}

buildAllProjectDistributions();
